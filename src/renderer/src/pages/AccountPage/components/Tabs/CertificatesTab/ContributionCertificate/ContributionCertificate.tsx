import { useTranslation } from 'react-i18next'
import {
  rcImpactAbi,
  rcImpactAddress,
  sequoiaRcImpactAbi,
  sequoiaRcImpactAddress
} from '@renderer/services/contracts'
import { useChainId, useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'

interface Props {
  certificateTokens: string
  name?: string
  address?: string
}

export function ContributionCertificate({ certificateTokens, name, address }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const rcImpactContract = {
    address: chainId === 250225 ? rcImpactAddress : sequoiaRcImpactAddress,
    abi: chainId === 250225 ? rcImpactAbi : sequoiaRcImpactAbi
  } as const

  const { data } = useReadContracts({
    contracts: [
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
        functionName: 'soilPerToken',
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

  if (data) {
    const _treesPerToken = data[0].status === 'success' ? (data[0]?.result as string) : '0'
    treesPerToken = parseFloat(
      formatUnits(BigInt(_treesPerToken), _treesPerToken.length > 32 ? 32 : _treesPerToken.length)
    )

    const _carbonPerToken = data[1].status === 'success' ? (data[1]?.result as string) : '0'
    carbonPerToken = parseFloat(
      formatUnits(
        BigInt(_carbonPerToken),
        _carbonPerToken.length > 32 ? 32 : _carbonPerToken.length
      )
    )

    const _soilPerToken = data[2].status === 'success' ? (data[2]?.result as string) : '0'
    soilPerToken = parseFloat(
      formatUnits(BigInt(_soilPerToken), _soilPerToken.length > 32 ? 32 : _soilPerToken.length)
    )

    const _biodiversityPerToken = data[3].status === 'success' ? (data[3]?.result as string) : '0'
    biodiversityPerToken = parseFloat(
      formatUnits(
        BigInt(_biodiversityPerToken),
        _biodiversityPerToken.length > 32 ? 32 : _biodiversityPerToken.length
      )
    )
  }

  totalCarbonImpact = carbonPerToken * parseInt(certificateTokens)
  totalSoilImpact = soilPerToken * parseInt(certificateTokens)
  totalBiodiversityImpact = biodiversityPerToken * parseInt(certificateTokens)
  totalTreesImpact = treesPerToken * parseInt(certificateTokens)

  return (
    <div className="flex flex-col rounded-2xl bg-green-card p-3 w-[500px]">
      <div className="flex flex-col items-center justify-center w-full h-14 border-b border-container-secondary pb-2">
        <p className="text-white font-bold">{name}</p>

        <p className="text-white">
          {t('contributedWith')}{' '}
          <span className="font-bold text-green-600 text-lg">
            {Intl.NumberFormat('pt-BR').format(parseInt(certificateTokens))}
          </span>{' '}
          RC
        </p>
      </div>

      <div className="flex items-center h-full w-full mt-1">
        <div className="flex flex-col flex-1 p-3 h-full">
          <p className="text-gray-300 text-sm">{t('impact')}</p>
          <ImpactItem
            label={t('carbon')}
            value={Intl.NumberFormat('pt-BR').format(totalCarbonImpact)}
          />
          <ImpactItem
            label={t('soil')}
            value={Intl.NumberFormat('pt-BR').format(totalSoilImpact)}
          />
          <ImpactItem
            label={t('bio.')}
            value={Intl.NumberFormat('pt-BR').format(totalBiodiversityImpact)}
          />
          <ImpactItem
            label={t('trees')}
            value={Intl.NumberFormat('pt-BR').format(totalTreesImpact)}
          />
        </div>

        <div className="flex-1 h-full flex flex-col items-center justify-center">
          <p className="text-white">qr-code</p>
          <div className="w-36 h-36 bg-white" />
        </div>
      </div>

      <p className="text-white text-center text-sm mt-3">{address}</p>
    </div>
  )
}

interface ImpactItemProps {
  label: string
  value: string
  suffix?: string
}
function ImpactItem({ label, value, suffix }: ImpactItemProps): JSX.Element {
  return (
    <p className="text-white text-sm">
      {label}: <span className="font-bold">{value}</span> {suffix && suffix}
    </p>
  )
}
