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
import { Loading } from '@renderer/components/Loading/Loading'

export function CalculatorItemsTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
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

  if (isLoading) {
    return (
      <div className="mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('calculatorItemsCount')}: {calculatorItemsCount}
      </p>

      {calculaorItemsIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('anyCalculatorItemsAvailable')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary">ID</th>
              <th className="p-2 border-r border-container-secondary">{t('researcher')}</th>
              <th className="p-2 border-r border-container-secondary">{t('title')}</th>
              <th className="p-2 border-r border-container-secondary">{t('unit')}</th>
              <th className="p-2 border-r border-container-secondary">{t('carbonImpact')}</th>
              <th className="p-2">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {calculaorItemsIds.map((id, index) => (
              <CalculatorItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
