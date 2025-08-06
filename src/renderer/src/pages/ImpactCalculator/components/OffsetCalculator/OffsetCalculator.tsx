import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { OffsetCalculatorItem } from './OffsetCalculatorItem'

export function OffsetCalculator(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'calculatorItemsCount',
    args: []
  })

  let calculaorItemsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))
    calculaorItemsIds = Array.from({ length: count }, (_, i) => i + 1)
  }

  return (
    <div className="flex flex-col mt-10">
      <h3 className="font-bold text-white text-xl">{t('impactCalculator.offset')}</h3>
      <p className="text-gray-200">{t('impactCalculator.descOffset')}</p>

      <div className="flex flex-col mt-5">
        {calculaorItemsIds.length === 0 ? (
          <div className="items-center mt-10">
            <p className="text-white text-center">
              {t('impactCalculator.noCalculatorItemsAvailable')}
            </p>
          </div>
        ) : (
          <table className="max-w-[1024px] w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
            <thead>
              <tr className="border-b border-container-secondary text-white">
                <th className="p-2 border-r border-container-secondary text-start">ID</th>
                <th className="p-2 border-r border-container-secondary text-start">
                  {t('impactCalculator.item')}
                </th>
                <th className="p-2 border-r border-container-secondary text-start">
                  {t('impactCalculator.unit')}
                </th>
                <th className="p-2 border-r border-container-secondary text-start">
                  {t('impactCalculator.carbonImpact')}
                </th>
                <th className="p-2 max-w-[300px] text-start">{t('impactCalculator.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {calculaorItemsIds.map((id, index) => (
                <OffsetCalculatorItem key={index} id={id} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
