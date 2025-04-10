import { useNavigate } from 'react-router-dom'

interface Props {
  poolName: PoolsName
}

export function PoolItem({ poolName }: Props): JSX.Element {
  const navigate = useNavigate()
  const poolData = pools[poolName]

  function handleNavigateToPool(): void {
    navigate(poolData?.path)
  }

  return (
    <button
      className="w-full rounded-2xl bg-container-primary p-5 gap-1 flex flex-col hover:cursor-pointer"
      onClick={handleNavigateToPool}
    >
      <h3 className="font-semibold text-white text-start">{poolData.title}</h3>
      <p className="text-gray-300 text-sm text-start">{poolData.description}</p>
    </button>
  )
}

const pools = {
  regenerator: {
    title: 'regenerator',
    description: 'descRegenerator',
    path: '/pools/regenerator',
    icon: null
  },
  inspector: {
    title: 'inspector',
    description: 'descInspector',
    path: '/pools/inspector',
    icon: null
  },
  researcher: {
    title: 'researcher',
    description: 'descresearcher',
    path: '/pools/researcher',
    icon: null
  },
  developer: {
    title: 'developer',
    description: 'descdeveloper',
    path: '/pools/developer',
    icon: null
  },
  contributor: {
    title: 'contributor',
    description: 'desccontributor',
    path: '/pools/contributor',
    icon: null
  },
  activist: {
    title: 'activist',
    description: 'descactivist',
    path: '/pools/activist',
    icon: null
  }
}

type PoolsName = keyof typeof pools
