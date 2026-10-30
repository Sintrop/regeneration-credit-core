import { Modal } from '@renderer/components/Modal/Modal'
import { useTranslation } from 'react-i18next'
import { useReadContract } from 'wagmi'
import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { CalculatorItemProps } from '@renderer/types/researcher'

interface OnChangeProps {
  id: number
  name: string
}

interface Props {
  close: () => void
  ids: number[]
  onChange: ({ id, name }: OnChangeProps) => void
}

export function ModalSelectCalculatorItem({ close, ids, onChange }: Props): JSX.Element {
  const { t } = useTranslation()

  function onChangeItem(data: OnChangeProps): void {
    onChange(data)
    close()
  }

  return (
    <Modal title={<>{t('actions.chooseAnItem')}</>} onClose={close}>
      <div className="flex flex-col gap-2">
        {ids.length === 0 ? (
          <div className="items-center mt-10">
            <p className="text-white text-center">{t('actions.noCalculatorItems')}</p>
          </div>
        ) : (
          <>
            {ids.map((id) => (
              <CalculatorItem key={id} id={id} onChange={onChangeItem} />
            ))}
          </>
        )}
      </div>
    </Modal>
  )
}

interface SelectCalculatorItemProps {
  id: number
  onChange: ({ id, name }: OnChangeProps) => void
}
function CalculatorItem({ id, onChange }: SelectCalculatorItemProps): JSX.Element {
  const { data } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi,
    functionName: 'getCalculatorItem',
    args: [id]
  })

  const calculatorItem = data as CalculatorItemProps

  return (
    <button
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-card-secondary text-left hover:ring-1 hover:ring-green-primary hover:cursor-pointer"
      onClick={() => onChange({ id, name: calculatorItem?.item })}
    >
      <span className="text-gray-400 text-sm">#{id}</span>

      {calculatorItem && (
        <>
          <span className="text-white font-semibold">{calculatorItem?.item}</span>
        </>
      )}
    </button>
  )
}
