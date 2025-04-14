import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { ModalSelectCalculatorItem } from './ModalSelectCalculatorItem'

interface OnChangeProps {
  id: number
  name: string
}

interface Props {
  onChangeItem: ({ id, name }: OnChangeProps) => void
}

export function SelectCalculatorItem({ onChangeItem }: Props): JSX.Element {
  const { t } = useTranslation()
  const [showModalSelect, setShowModalSelect] = useState(false)
  const [itemSelected, setItemSelected] = useState<OnChangeProps>()

  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'calculatorItemsCount',
    args: []
  })

  let calculatorItemsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    calculatorItemsIds = ids.reverse()
  }

  function handleOnChangeItem(data: OnChangeProps): void {
    setItemSelected(data)
    onChangeItem(data)
  }

  return (
    <div className="flex flex-col">
      {itemSelected && (
        <div className="flex flex-col gap-1 my-3">
          <p className="text-sm mt-3 text-gray-300">{t('selectedItem')}:</p>
          <p className="text-white">
            ID: {itemSelected.id} - {itemSelected?.name}
          </p>
        </div>
      )}

      <button
        className="rounded-2xl px-10 w-fit h-8 text-white font-semibold bg-green-btn hover:cursor-pointer"
        onClick={() => setShowModalSelect(true)}
      >
        {t('chooseCalculatorItem')}
      </button>

      {showModalSelect && (
        <ModalSelectCalculatorItem
          close={() => setShowModalSelect(false)}
          ids={calculatorItemsIds}
          onChange={handleOnChangeItem}
        />
      )}
    </div>
  )
}
