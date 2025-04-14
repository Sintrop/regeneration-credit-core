import {
  regeneratorPoolAbi,
  regeneratorPoolAddress,
  sequoiaRegeneratorPoolAbi,
  sequoiaRegeneratorPoolAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

export function InfoBar(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data: responseCurrentEra } = useReadContract({
    address: chainId === 250225 ? regeneratorPoolAddress : sequoiaRegeneratorPoolAddress,
    abi: chainId === 250225 ? regeneratorPoolAbi : sequoiaRegeneratorPoolAbi,
    functionName: 'currentContractEra'
  })

  const currentEra = responseCurrentEra ? formatUnits(BigInt(responseCurrentEra as string), 0) : 0

  const { data: responseNextEra } = useReadContract({
    address: chainId === 250225 ? regeneratorPoolAddress : sequoiaRegeneratorPoolAddress,
    abi: chainId === 250225 ? regeneratorPoolAbi : sequoiaRegeneratorPoolAbi,
    functionName: 'nextEraIn',
    args: [currentEra]
  })

  const nextEra = responseNextEra
    ? Intl.NumberFormat('pt-BR').format(
        parseFloat(formatUnits(BigInt(responseNextEra as string), 0))
      )
    : 0

  const { data: responseCurrentEpoch } = useReadContract({
    address: chainId === 250225 ? regeneratorPoolAddress : sequoiaRegeneratorPoolAddress,
    abi: chainId === 250225 ? regeneratorPoolAbi : sequoiaRegeneratorPoolAbi,
    functionName: 'currentEpoch'
  })

  const currentEpoch = responseCurrentEpoch
    ? formatUnits(BigInt(responseCurrentEpoch as string), 0)
    : 0

  return (
    <div className="flex items-center gap-8 w-full min-h-10 bg-green-700 px-5">
      <p className="text-gray-300 text-sm">
        {t('currentEra')}: <span className="text-white font-semibold text-base">{currentEra}</span>
      </p>

      <p className="text-gray-300 text-sm">
        {t('nextEraIn')}:{' '}
        <span className="text-white font-semibold text-base">
          {nextEra} {t('blocks')}
        </span>
      </p>

      <p className="text-gray-300 text-sm">
        {t('currentEpoch')}:{' '}
        <span className="text-white font-semibold text-base">{currentEpoch}</span>
      </p>
    </div>
  )
}
