import { Modal } from '@renderer/components/Modal/Modal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalculatorItemProps } from '@renderer/types/researcher'
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
        className="w-full h-11 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer"
        onClick={handleShowModal}
      >
        {t('impactCalculator.offset')}
      </button>

      {showModal && (
        <Modal title={<>{t('impactCalculator.offset')}</>} onClose={handleCloseModal}>
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
        </Modal>
      )}
    </div>
  )
}
