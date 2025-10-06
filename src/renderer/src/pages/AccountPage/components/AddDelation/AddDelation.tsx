import { SendTransactionButton } from '@renderer/components/ScreenPage/components/ActionBar/Actions/components/SendTransactionButton/SendTransactionButton'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdClose } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

interface Props {
  address: string
}
export function AddDelation({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const mainnet = useMainnet()
  const [showModal, setShowModal] = useState(false)

  const [inputTitle, setInputTitle] = useState('')
  const [inputTestimony, setInputTestimony] = useState('')

  const { switchChain, isSuccess: isSuccessSwitch } = useSwitchChain()
  const { writeContract, isPending, data: hash, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  async function handleSendTransaction(): Promise<void> {
    setDisplayLoadingTx(true)

    await switchChain()
    if (!isSuccessSwitch) {
      setDisplayLoadingTx(false)
      return
    }

    writeContract({
      address: mainnet ? userAddress : sequoiaUserAddress,
      abi: mainnet ? userAbi : sequoiaUserAbi,
      functionName: 'addDelation',
      args: [address, inputTitle, inputTestimony]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.delationSent'), { type: 'success' })
    toggleShowModal()
  }

  function toggleShowModal(): void {
    setShowModal((value) => !value)
    setInputTestimony('')
    setInputTitle('')
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={toggleShowModal}
        className="px-10 h-10 rounded-2xl w-fit border-2 border-yellow-600 text-yellow-600 font-semibold hover:cursor-pointer hover:border-yellow-700 hover:text-yellow-700 duration-200"
      >
        {t('account.addDelation')}
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-[500px]">
            <div className="flex items-center justify-between w-full">
              <p className="text-white">{t('account.addDelation')}</p>
              <button className="hover:cursor-pointer text-white" onClick={toggleShowModal}>
                <MdClose color="white" size={25} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <p className="text-white my-5">{t('descActions.addDelation')}</p>

              <div className="flex flex-col pt-5">
                <p className="text-sm mt-3 text-gray-300">{t('actions.reportTitle')}:</p>
                <input
                  value={inputTitle}
                  className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
                  placeholder={t('actions.typeHere')}
                  onChange={(e) => setInputTitle(e.target.value)}
                  maxLength={100}
                />

                <p className="text-sm mt-3 text-gray-300">{t('actions.reportTestimony')}:</p>
                <input
                  value={inputTestimony}
                  className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
                  placeholder={t('actions.typeHere')}
                  onChange={(e) => setInputTestimony(e.target.value)}
                  maxLength={300}
                />

                <SendTransactionButton
                  label={t('actions.report')}
                  handleSendTransaction={handleSendTransaction}
                  disabled={!inputTestimony.trim() || !inputTitle.trim() || isPending}
                />

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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
