import { Loading } from '@renderer/components/Loading/Loading'
import { SendTransactionButton } from '@renderer/components/ScreenPage/components/ActionBar/Actions/components/SendTransactionButton/SendTransactionButton'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useAcceptInspection } from '@renderer/domain/Inspection/useCases/useAcceptInspection'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress,
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdClose } from 'react-icons/md'
import { toast } from 'react-toastify'
import { formatUnits } from 'viem'
import {
  useAccount,
  useBlockNumber,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt
} from 'wagmi'

interface Props {
  inspectionId: number
  createdAt: number
  close: () => void
}

export function AcceptInspection({ inspectionId, createdAt, close }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const [canAccept, setCanAccept] = useState<boolean>(false)
  const [canAcceptIn, setCanAcceptIn] = useState<number>(0)
  const [waitNextEraToAccept, setWaitNextEraToAccept] = useState(false)
  const { switchChain, isSuccess: isSuccessSwitch } = useSwitchChain()

  const { address } = useAccount()
  const { data: responseUser } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  const userType = responseUser ? parseInt(formatUnits(BigInt(responseUser as string), 0)) : -1

  const { data: responseBlock } = useBlockNumber()
  const blockNumber = responseBlock ? parseInt(formatUnits(BigInt(responseBlock), 0)) : 0

  const { data: responseNextEra } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'nextEraIn'
  })
  const nextEraIn = responseNextEra
    ? parseInt(formatUnits(BigInt(responseNextEra as string), 0))
    : 0

  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)
  const { acceptInspection, isError, isPending, error, hash } = useAcceptInspection()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error : isErrorTx ? errorTx.message : ''

  useEffect(() => {
    checkIfCanAcceptInspection()
  }, [blockNumber, createdAt, nextEraIn])

  function checkIfCanAcceptInspection(): void {
    const blocksToExpire = parseInt(import.meta.env.VITE_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION)
    const securityBlocks = parseInt(import.meta.env.VITE_SECURITY_BLOCKS_TO_VALIDATOR_ANALYSIS)

    if (nextEraIn < blocksToExpire) {
      setWaitNextEraToAccept(true)
      return
    }

    if (nextEraIn - blocksToExpire > securityBlocks) {
      setWaitNextEraToAccept(false)
    } else {
      setWaitNextEraToAccept(true)
      return
    }

    const delayToAccept = parseInt(import.meta.env.VITE_ACCEPT_INSPECTION_DELAY_BLOCKS)
    const blockCanAccept = createdAt + delayToAccept

    if (blockNumber > blockCanAccept) {
      setCanAccept(true)
    } else {
      setCanAccept(false)
      setCanAcceptIn(blockCanAccept - blockNumber)
    }
  }

  async function handleAcceptInspection(): Promise<void> {
    setDisplayLoadingTx(true)

    await switchChain()
    if (!isSuccessSwitch) {
      setDisplayLoadingTx(false)
      return
    }
    acceptInspection({ inspectionId })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast.success(t('actions.acceptedInspection'))
    close()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
      <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-96">
        <div className="flex items-center justify-between w-full">
          <p className="text-white">{t('actions.acceptInspection')}</p>
          <button className="hover:cursor-pointer text-white" onClick={close}>
            <MdClose color="white" size={25} />
          </button>
        </div>

        {userType === -1 || blockNumber === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-[200px] overflow-hidden">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-[200px]">
            {userType === 2 ? (
              <>
                {canAccept ? (
                  <>
                    <p className="text-white text-center">
                      {t('actions.doYouWantToAcceptThisInspection')}
                    </p>
                    <p className="text-white text-center font-bold text-2xl">ID: {inspectionId}</p>

                    <SendTransactionButton
                      label={t('actions.acceptInspection')}
                      handleSendTransaction={handleAcceptInspection}
                      disabled={isLoading || isPending}
                    />
                  </>
                ) : (
                  <>
                    {waitNextEraToAccept ? (
                      <>
                        <p className="text-white text-center">
                          {t('actions.youCanNotAcceptThisInspectionNow')}
                        </p>
                        <p className="text-white text-center">{t('actions.waitToNextEra')}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-white text-center">
                          {t('actions.youCanNotAcceptThisInspectionNow')}
                        </p>
                        <p className="text-white text-center">
                          {t('common.wait')} {canAcceptIn} {t('common.blocks')}
                        </p>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <p className="text-white text-center">{t('actions.youAreNotInspector')}</p>
            )}
          </div>
        )}
      </div>

      {displayLoadingTx && (
        <TransactionLoading
          close={() => setDisplayLoadingTx(false)}
          ok={success}
          isError={isError || isErrorTx}
          isPending={isPending}
          isSuccess={isSuccess}
          loading={isLoading}
          errorMessage={errorMessage}
          transactionHash={hash}
        />
      )}
    </div>
  )
}
