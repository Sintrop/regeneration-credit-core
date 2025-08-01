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

const REGENERATOR_POOL_FUNDS = import.meta.env.VITE_REGENERATOR_POOL_FUNDS
const INSPECTOR_POOL_FUNDS = import.meta.env.VITE_INSPECTOR_POOL_FUNDS
const RESEARCHER_POOL_FUNDS = import.meta.env.VITE_RESEARCHER_POOL_FUNDS
const DEVELOPER_POOL_FUNDS = import.meta.env.VITE_DEVELOPER_POOL_FUNDS
const CONTRIBUTOR_POOL_FUNDS = import.meta.env.VITE_CONTRIBUTOR_POOL_FUNDS
const ACTIVIST_POOL_FUNDS = import.meta.env.VITE_ACTIVIST_POOL_FUNDS

const pools = {
  regenerator: {
    title: 'pools.regeneratorsPool',
    description: 'pools.descRegeneratorPool',
    path: '/pools/regenerator',
    icon: null,
    poolFunds: BigInt(REGENERATOR_POOL_FUNDS)
  },
  inspector: {
    title: 'pools.inspectorsPool',
    description: 'pools.descInspectorsPool',
    path: '/pools/inspector',
    icon: null,
    poolFunds: BigInt(INSPECTOR_POOL_FUNDS)
  },
  researcher: {
    title: 'pools.researchersPool',
    description: 'pools.descResearchersPool',
    path: '/pools/researcher',
    icon: null,
    poolFunds: BigInt(RESEARCHER_POOL_FUNDS)
  },
  developer: {
    title: 'pools.developersPool',
    description: 'pools.descDevelopersPool',
    path: '/pools/developer',
    icon: null,
    poolFunds: BigInt(DEVELOPER_POOL_FUNDS)
  },
  contributor: {
    title: 'pools.contributorsPool',
    description: 'pools.descContributorsPool',
    path: '/pools/contributor',
    icon: null,
    poolFunds: BigInt(CONTRIBUTOR_POOL_FUNDS)
  },
  activist: {
    title: 'pools.activistsPool',
    description: 'pools.descActivistsPool',
    path: '/pools/activist',
    icon: null,
    poolFunds: BigInt(ACTIVIST_POOL_FUNDS)
  }
}

type PoolsName = keyof typeof pools
