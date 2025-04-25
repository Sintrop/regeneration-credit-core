import { useTranslation } from 'react-i18next'
import { useChainId, useReadContract } from 'wagmi'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-96">
        <div className="flex items-center justify-between w-full">
          <p className="">{t('chooseAnItem')}</p>
          <button className="hover:cursor-pointer" onClick={close}>
            X
          </button>
        </div>

        <div className="flex flex-col mt-5 max-h-[400px] overflow-y-auto">
          {ids.length === 0 ? (
            <div className="items-center mt-10">
              <p className="text-white text-center">{t('anyCalculatorItemsAvailable')}</p>
            </div>
          ) : (
            <>
              {ids.map((id) => (
                <CalculatorItem key={id} id={id} onChange={onChangeItem} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface SelectCalculatorItemProps {
  id: number
  onChange: ({ id, name }: OnChangeProps) => void
}
function CalculatorItem({ id, onChange }: SelectCalculatorItemProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getCalculatorItem',
    args: [id]
  })

  const calculatorItem = data as CalculatorItemProps

  return (
    <button
      className="flex items-center gap-3 px-5 py-2 border-b hover:cursor-pointer"
      onClick={() => onChange({ id, name: calculatorItem?.title })}
    >
      <p className="text-black">ID: {id}</p>

      {calculatorItem && (
        <>
          <p className="text-black">
            {t('name')}: {calculatorItem?.title}
          </p>
        </>
      )}
    </button>
  )
}
