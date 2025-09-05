import { Loading } from '@renderer/components/Loading/Loading'
import { SendTransactionButton } from '@renderer/components/ScreenPage/components/ActionBar/Actions/components/SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import {
  inspectionAbi,
  inspectionAddress,
  regeneratorAbi,
  regeneratorAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress,
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits, WriteContractErrorType } from 'viem'
import {
  useAccount,
  useBlockNumber,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
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

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })

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

  function handleAcceptInspection(): void {
    const address = chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress
    const abi = chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi

    writeContract({
      address,
      abi,
      functionName: 'acceptInspection',
      args: [inspectionId]
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
      <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-96">
        <div className="flex items-center justify-between w-full">
          <p className="text-white">{t('acceptInspection')}</p>
          <button className="hover:cursor-pointer text-white" onClick={close}>
            X
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
                      {t('doYouWantToAcceptThisInspection?')}
                    </p>
                    <p className="text-white text-center font-bold text-2xl">ID: {inspectionId}</p>

                    <SendTransactionButton
                      label={t('acceptInspection')}
                      handleSendTransaction={handleAcceptInspection}
                      disabled={isLoading || isPending}
                    />

                    <TransactionData
                      errorTx={error as WriteContractErrorType}
                      hash={hash}
                      isLoading={isLoading}
                      isPending={isPending}
                      isSuccess={isSuccess}
                      isError={isError}
                    />
                  </>
                ) : (
                  <>
                    {waitNextEraToAccept ? (
                      <>
                        <p className="text-white text-center">
                          {t("youCan'tAcceptThisInspectionNow")}
                        </p>
                        <p className="text-white text-center">{t('waitToNextEra')}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-white text-center">
                          {t("youCan'tAcceptThisInspectionNow")}
                        </p>
                        <p className="text-white text-center">
                          {t('wait')} {canAcceptIn} {t('blocks')}
                        </p>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <p className="text-white text-center">{t('youAreNotInspector')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
