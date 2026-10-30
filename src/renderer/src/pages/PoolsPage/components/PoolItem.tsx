import { POOL_FUNDS } from '@renderer/services/poolFunds'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'

interface Props {
  poolName: PoolsName
}

export function PoolItem({ poolName }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const poolData = pools[poolName]

  function handleNavigateToPool(): void {
    navigate(poolData?.path)
  }

  return (
    <div className="w-64 rounded-2xl bg-container-primary p-5 gap-3 flex flex-col justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-white text-start">{t(poolData.title)}</h3>
        <p className="text-gray-300 text-sm text-start">{t(poolData.description)}</p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-col">
          <p className="text-xs text-gray-300">{t('pools.totalFunds')}</p>
          <p className="text-white">
            {Intl.NumberFormat('pt-BR').format(parseInt(formatUnits(poolData.poolFunds, 18)))} RC
          </p>
        </div>

        <button
          className="text-green-600 underline hover:cursor-pointer w-fit"
          onClick={handleNavigateToPool}
        >
          {t('see')}
        </button>
      </div>
    </div>
  )
}

const pools = {
  regenerator: {
    title: 'pools.regeneratorsPool',
    description: 'pools.descRegeneratorPool',
    path: '/pools/regenerator',
    icon: null,
    poolFunds: POOL_FUNDS.REGENERATOR
  },
  inspector: {
    title: 'pools.inspectorsPool',
    description: 'pools.descInspectorsPool',
    path: '/pools/inspector',
    icon: null,
    poolFunds: POOL_FUNDS.INSPECTOR
  },
  researcher: {
    title: 'pools.researchersPool',
    description: 'pools.descResearchersPool',
    path: '/pools/researcher',
    icon: null,
    poolFunds: POOL_FUNDS.RESEARCHER
  },
  developer: {
    title: 'pools.developersPool',
    description: 'pools.descDevelopersPool',
    path: '/pools/developer',
    icon: null,
    poolFunds: POOL_FUNDS.DEVELOPER
  },
  contributor: {
    title: 'pools.contributorsPool',
    description: 'pools.descContributorsPool',
    path: '/pools/contributor',
    icon: null,
    poolFunds: POOL_FUNDS.CONTRIBUTOR
  },
  activist: {
    title: 'pools.activistsPool',
    description: 'pools.descActivistsPool',
    path: '/pools/activist',
    icon: null,
    poolFunds: POOL_FUNDS.ACTIVIST
  },
  validation: {
    title: 'pools.validationPool',
    description: 'pools.descValidationPool',
    path: '/pools/validation',
    icon: null,
    poolFunds: POOL_FUNDS.VALIDATION
  }
}

type PoolsName = keyof typeof pools
