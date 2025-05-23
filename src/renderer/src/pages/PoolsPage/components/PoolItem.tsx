import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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

      <button
        className="mt-10 text-green-600 underline hover:cursor-pointer w-fit"
        onClick={handleNavigateToPool}
      >
        {t('see')}
      </button>
    </div>
  )
}

const pools = {
  regenerator: {
    title: 'regeneratorsPool',
    description: 'descRegeneratorPool',
    path: '/pools/regenerator',
    icon: null
  },
  inspector: {
    title: 'inspectorsPool',
    description: 'descInspectorsPool',
    path: '/pools/inspector',
    icon: null
  },
  researcher: {
    title: 'researchersPool',
    description: 'descResearchersPool',
    path: '/pools/researcher',
    icon: null
  },
  developer: {
    title: 'developersPool',
    description: 'descDevelopersPool',
    path: '/pools/developer',
    icon: null
  },
  contributor: {
    title: 'contributorsPool',
    description: 'descContributorsPool',
    path: '/pools/contributor',
    icon: null
  },
  activist: {
    title: 'activistsPool',
    description: 'descActivistsPool',
    path: '/pools/activist',
    icon: null
  }
}

type PoolsName = keyof typeof pools
