import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalculatorItemProps } from '@renderer/types/researcher'

interface Props {
  item: CalculatorItemProps
}
export function ModalOffsetCalculator({ item }: Props): JSX.Element {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  function handleShowModal(): void {
    setShowModal(true)
  }

  function handleCloseModal(): void {
    setShowModal(false)
  }

  return (
    <div>
      <button
        className="w-[100px] h-10 rounded-2xl bg-red-500 text-white hover:cursor-pointer"
        onClick={handleShowModal}
      >
        {t('impactCalculator.offset')}
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-96">
            <div className="flex items-center justify-between w-full">
              <p className="text-white">{t('impactCalculator.offset')}</p>
              <button className="hover:cursor-pointer text-white" onClick={handleCloseModal}>
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
