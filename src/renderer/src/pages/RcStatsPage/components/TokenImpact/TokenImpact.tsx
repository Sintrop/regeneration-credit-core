import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContracts } from 'wagmi'
import { StatsRcItem } from '../StatsRcItem'
import {
  rcImpactAbi,
  rcImpactAddress,
  sequoiaRcImpactAbi,
  sequoiaRcImpactAddress
} from '@renderer/services/contracts'
import { Loading } from '@renderer/components/Loading/Loading'

export function TokenImpact(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const rcImpactContract = {
    address: chainId === 250225 ? rcImpactAddress : sequoiaRcImpactAddress,
    abi: chainId === 250225 ? rcImpactAbi : sequoiaRcImpactAbi
  } as const

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        ...rcImpactContract,
        functionName: 'totalCarbonImpact',
        args: []
      },
      {
        ...rcImpactContract,
        functionName: 'totalAreaImpact',
        args: []
      },
      {
        ...rcImpactContract,
        functionName: 'totalBiodiversityImpact',
        args: []
      },
      {
        ...rcImpactContract,
        functionName: 'totalTreesImpact',
        args: []
      },
      {
        ...rcImpactContract,
        functionName: 'treesPerToken',
        args: []
      },
      {
        ...rcImpactContract,
        functionName: 'carbonPerToken',
        args: []
      },
      {
        ...rcImpactContract,
        functionName: 'areaPerToken',
        args: []
      },
      {
        ...rcImpactContract,
        functionName: 'biodiversityPerToken',
        args: []
      }
    ]
  })

  let totalCarbonImpact = 0
  let totalSoilImpact = 0
  let totalBiodiversityImpact = 0
  let totalTreesImpact = 0
  let treesPerToken = 0
  let carbonPerToken = 0
  let soilPerToken = 0
  let biodiversityPerToken = 0

  console.log(data)

  if (data) {
    const _totalCarbonImpact = data[0].status === 'success' ? (data[0]?.result as string) : '0'
    totalCarbonImpact = parseFloat(formatUnits(BigInt(_totalCarbonImpact), 0))

    const _totalSoilImpact = data[1].status === 'success' ? (data[1]?.result as string) : '0'
    totalSoilImpact = parseFloat(formatUnits(BigInt(_totalSoilImpact), 0))

    const _totalBiodiversityImpact =
      data[2].status === 'success' ? (data[2]?.result as string) : '0'
    totalBiodiversityImpact = parseFloat(formatUnits(BigInt(_totalBiodiversityImpact), 0))

    const _totalTreesImpact = data[3].status === 'success' ? (data[3]?.result as string) : '0'
    totalTreesImpact = parseFloat(formatUnits(BigInt(_totalTreesImpact), 0))

    const _treesPerToken = data[4].status === 'success' ? (data[4]?.result as string) : '0'
    treesPerToken = parseFloat(formatUnits(BigInt(_treesPerToken), 18))

    const _carbonPerToken = data[5].status === 'success' ? (data[5]?.result as string) : '0'
    carbonPerToken = parseFloat(formatUnits(BigInt(_carbonPerToken), 18))

    const _soilPerToken = data[6].status === 'success' ? (data[6]?.result as string) : '0'
    soilPerToken = parseFloat(formatUnits(BigInt(_soilPerToken), 18))

    const _biodiversityPerToken = data[7].status === 'success' ? (data[7]?.result as string) : '0'
    biodiversityPerToken = parseFloat(formatUnits(BigInt(_biodiversityPerToken), 18))
  }

  return (
    <div className="flex flex-col mt-5">
      {isLoading ? (
        <div className="mx-auto overflow-hidden">
          <Loading />
        </div>
      ) : (
        <>
          <p className="text-white mb-2">{t('tokenTotalImpact')}</p>
          <div className="flex flex-wrap gap-5">
            <StatsRcItem
              title={t('totalCarbonImpact')}
              value={Intl.NumberFormat('pt-BR').format(totalCarbonImpact)}
            />
            <StatsRcItem
              title={t('totalAreaImpact')}
              value={Intl.NumberFormat('pt-BR').format(totalSoilImpact)}
              suffix="m²"
            />
            <StatsRcItem
              title={t('totalBiodiversityImpact')}
              value={Intl.NumberFormat('pt-BR').format(totalBiodiversityImpact)}
            />
            <StatsRcItem
              title={t('totalTreesImpact')}
              value={Intl.NumberFormat('pt-BR').format(totalTreesImpact)}
            />
          </div>

          <p className="text-white mb-2 mt-7">{t('impactPerToken')}</p>
          <div className="flex flex-wrap gap-5">
            <StatsRcItem title={t('treesPerToken')} value={treesPerToken.toString()} />
            <StatsRcItem title={t('carbonPerToken')} value={carbonPerToken.toString()} />
            <StatsRcItem title={t('areaPerToken')} value={soilPerToken.toString()} />
            <StatsRcItem
              title={t('biodiversityPerToken')}
              value={biodiversityPerToken.toString()}
            />
          </div>
        </>
      )}
    </div>
  )
}
