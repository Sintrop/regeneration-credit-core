/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalculatorItemProps } from '@renderer/types/researcher'
import { MdClose } from 'react-icons/md'
import { useAllowance } from '@renderer/domain/Supporter/useCases/useAllowance'
import { Approve } from './Approve'
import { Offset } from './Offset'
import { Loading } from '@renderer/components/Loading/Loading'

interface Props {
  item: CalculatorItemProps
}
export function ModalOffsetCalculator({ item }: Props): JSX.Element {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [approveMore, setApproveMore] = useState(false)

  const { tokensAllowed, isLoading: isLoadingAllowance, refetch } = useAllowance()

  function handleShowModal(): void {
    setShowModal(true)
  }

  function handleCloseModal(): void {
    setShowModal(false)
    setApproveMore(false)
  }

  function handleApproveMore(): void {
    setApproveMore(true)
  }

  function handleCloseApproveMore(): void {
    setApproveMore(false)
  }

  function handleRefetchTokensAllowed(): void {
    handleCloseApproveMore()
    refetch()
  }

  return (
    <div>
      <button
        className="w-[100px] h-10 rounded-2xl bg-blue-primary text-white hover:cursor-pointer"
        onClick={handleShowModal}
      >
        {t('impactCalculator.offset')}
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-[500px]">
            <div className="flex items-center justify-between w-full">
              <p className="text-white">{t('impactCalculator.offset')}</p>
              <button className="hover:cursor-pointer text-white" onClick={handleCloseModal}>
                <MdClose size={25} color="white" />
              </button>
            </div>

            {isLoadingAllowance ? (
              <div className="flex w-full h-[300px] items-center justify-center">
                <Loading size={100} />
              </div>
            ) : (
              <>
                {approveMore ? (
                  <Approve refetchAllowance={handleRefetchTokensAllowed} />
                ) : (
                  <>
                    {tokensAllowed === 0 ? (
                      <Approve refetchAllowance={handleRefetchTokensAllowed} />
                    ) : (
                      <Offset
                        close={handleCloseModal}
                        item={item}
                        tokensAllowed={tokensAllowed}
                        handleApproveMore={handleApproveMore}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
