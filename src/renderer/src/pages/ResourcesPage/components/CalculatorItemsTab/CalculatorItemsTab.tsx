import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { CalculatorItem } from './CalculatorItem'
import { Loading } from '@renderer/components/Loading/Loading'

export function CalculatorItemsTab(): JSX.Element {
  const { t } = useTranslation()

  const { data, isLoading } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi,
    functionName: 'calculatorItemsCount',
    args: []
  })

  let calculaorItemsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

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
      {calculaorItemsIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('resources.noCalculatorItemsAvailable')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary text-start">ID</th>
              <th className="p-2 border-r border-container-secondary max-w-[100px] text-start">
                {t('resources.researcher')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">
                {t('resources.item')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">
                {t('resources.unit')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">
                {t('resources.carbonImpact')}
              </th>
              <th className="p-2">{t('resources.actions')}</th>
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
