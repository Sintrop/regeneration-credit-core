import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { StatsRcItem } from '../StatsRcItem'
import { Loading } from '@renderer/components/Loading/Loading'
import { useMainnet } from '@renderer/hooks/useMainnet'
import { EraSelector } from '@renderer/components/EraSelector/EraSelector'
import { useEra } from '@renderer/hooks/useEra'

export function ImpactPerEra(): JSX.Element {
  const { t } = useTranslation()
  const { currentEra } = useEra()
  const [era, setEra] = useState(1)
  const mainnet = useMainnet()
  const { data, isLoading } = useReadContract({
    address: mainnet ? inspectionAddress : sequoiaInspectionAddress,
    abi: mainnet ? inspectionAbi : sequoiaInspectionAbi,
    functionName: 'impactPerEra',
    args: [era]
  })

  useEffect(() => {
    setEra(currentEra)
  }, [currentEra])

  let totalInspections = 0
  let totalBiodiversityImpact = 0
  let totalTreesImpact = 0

  if (data) {
    const _totalTreesImpact = data ? (data[0] as string) : '0'
    totalTreesImpact = parseFloat(formatUnits(BigInt(_totalTreesImpact), 0))

    const _totalBiodiversityImpact = data ? (data[1] as string) : '0'
    totalBiodiversityImpact = parseFloat(formatUnits(BigInt(_totalBiodiversityImpact), 0))

    const _totalInspections = data ? (data[2] as string) : '0'
    totalInspections = parseFloat(formatUnits(BigInt(_totalInspections), 0))
  }

  return (
    <div className="flex flex-col mt-5">
      <p className="text-white mb-2">{t('tokenImpact.impactPerEra')}</p>
      <div className="overflow-x-auto">
        <EraSelector currentEra={currentEra} onChange={setEra} selectedEra={era} />
      </div>
      {isLoading ? (
        <div className="mx-auto overflow-hidden">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-5">
            <StatsRcItem
              title={t('tokenImpact.totalTreesImpact')}
              value={Intl.NumberFormat('pt-BR').format(totalTreesImpact)}
            />
            <StatsRcItem
              title={t('tokenImpact.totalBiodiversityImpact')}
              value={Intl.NumberFormat('pt-BR').format(totalBiodiversityImpact)}
            />
            <StatsRcItem
              title={t('common.totalInspections')}
              value={Intl.NumberFormat('pt-BR').format(totalInspections)}
            />
          </div>
        </>
      )}
    </div>
  )
}
