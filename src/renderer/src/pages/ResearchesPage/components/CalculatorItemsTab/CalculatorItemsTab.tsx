import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { CalculatorItem } from './CalculatorItem'

export function CalculatorItemsTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'calculatorItemsCount',
    args: []
  })

  let calculatorItemsCount: number = 0
  let calculaorItemsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))
    calculatorItemsCount = count

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    calculaorItemsIds = ids.reverse()
  }

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('calculatorItemsCount')}: {calculatorItemsCount}
      </p>
      <div className="flex items-center bg-container-primary rounded-t-2xl px-5 h-10 border-b-2 border-container-secondary">
        <div className="border-r border-container-secondary w-[50px]">
          <p className="text-white font-semibold">ID</p>
        </div>

        <div className="border-r border-container-secondary flex-1 pl-5">
          <p className="text-white font-semibold">{t('researcher')}</p>
        </div>

        <div className="border-r border-container-secondary w-[120px] pl-5">
          <p className="text-white font-semibold">{t('title')}</p>
        </div>

        <div className="border-r border-container-secondary w-[120px] pl-5">
          <p className="text-white font-semibold">{t('unit')}</p>
        </div>

        <div className="border-r border-container-secondary w-[200px] pl-5">
          <p className="text-white font-semibold">{t('carbonImpact')}</p>
        </div>

        <div className="border-r border-container-secondary w-[120px] pl-5">
          <p className="text-white font-semibold">{t('actions')}</p>
        </div>
      </div>

      {calculaorItemsIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('anyCalculatorItemsAvailable')}</p>
        </div>
      ) : (
        <>
          {calculaorItemsIds.map((id, index) => (
            <CalculatorItem key={index} id={id} />
          ))}
        </>
      )}
    </div>
  )
}
