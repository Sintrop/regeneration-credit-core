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
    <div className="w-64 rounded-2xl bg-container-primary p-5 gap-1 flex flex-col">
      <h3 className="font-semibold text-white text-start">{t(poolData.title)}</h3>
      <p className="text-gray-300 text-sm text-start">{t(poolData.description)}</p>

      <div className="mt-3 flex flex-col">
        <p className="text-xs text-gray-300">{t('totalFunds')}</p>
        <p className="text-white">
          {Intl.NumberFormat('pt-BR').format(parseInt(formatUnits(poolData.poolFunds, 18)))} RC
        </p>
      </div>

      <button
        className="mt-10 text-green-600 underline hover:cursor-pointer w-fit"
        onClick={handleNavigateToPool}
      >
        {t('see')}
      </button>
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
    title: 'regeneratorsPool',
    description: 'descRegeneratorPool',
    path: '/pools/regenerator',
    icon: null,
    poolFunds: BigInt(REGENERATOR_POOL_FUNDS)
  },
  inspector: {
    title: 'inspectorsPool',
    description: 'descInspectorsPool',
    path: '/pools/inspector',
    icon: null,
    poolFunds: BigInt(INSPECTOR_POOL_FUNDS)
  },
  researcher: {
    title: 'researchersPool',
    description: 'descResearchersPool',
    path: '/pools/researcher',
    icon: null,
    poolFunds: BigInt(RESEARCHER_POOL_FUNDS)
  },
  developer: {
    title: 'developersPool',
    description: 'descDevelopersPool',
    path: '/pools/developer',
    icon: null,
    poolFunds: BigInt(DEVELOPER_POOL_FUNDS)
  },
  contributor: {
    title: 'contributorsPool',
    description: 'descContributorsPool',
    path: '/pools/contributor',
    icon: null,
    poolFunds: BigInt(CONTRIBUTOR_POOL_FUNDS)
  },
  activist: {
    title: 'activistsPool',
    description: 'descActivistsPool',
    path: '/pools/activist',
    icon: null,
    poolFunds: BigInt(ACTIVIST_POOL_FUNDS)
  }
}

type PoolsName = keyof typeof pools
