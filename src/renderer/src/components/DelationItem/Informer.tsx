import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { HeaderFeedItem } from '../../pages/HomePage/components/FeedTabs/HeaderFeedItem/HeaderFeedItem'
import { useRegenerator } from '@renderer/domain/Regenerator/useCases/useRegenerator'
import { useDeveloper } from '@renderer/domain/Developer/useCases/useDeveloper'
import { useInspector } from '@renderer/domain/Inspector/useCases/useInspector'
import { useResearcher } from '@renderer/domain/Researcher/useCases/useResearcher'
import { useContributor } from '@renderer/domain/Contributor/useCases/useContributor'
import { useActivist } from '@renderer/domain/Activist/useCases/useActivist'

interface Props {
  informer: string
  createdAt: number
}
export function Informer({ informer, createdAt }: Props): JSX.Element {
  const mainnet = useMainnet()
  const { data } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [informer]
  })

  const userType = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0

  if (userType === 1) return <Regenerator createdAt={createdAt} informer={informer} />
  if (userType === 2) return <Inspector createdAt={createdAt} informer={informer} />
  if (userType === 3) return <Researcher createdAt={createdAt} informer={informer} />
  if (userType === 4) return <Developer createdAt={createdAt} informer={informer} />
  if (userType === 5) return <Contributor createdAt={createdAt} informer={informer} />
  if (userType === 6) return <Activist createdAt={createdAt} informer={informer} />

  return <div />
}

function Regenerator({ informer, createdAt }: Props): JSX.Element {
  const { regenerator, isLoading } = useRegenerator({ address: informer })
  return (
    <HeaderFeedItem
      address={informer}
      name={regenerator.name}
      proofPhoto={regenerator.proofPhoto}
      isLoading={isLoading}
      publishedAt={createdAt.toString()}
    />
  )
}

function Inspector({ informer, createdAt }: Props): JSX.Element {
  const { inspector, isLoading } = useInspector({ address: informer })
  return (
    <HeaderFeedItem
      address={informer}
      name={inspector.name}
      proofPhoto={inspector.proofPhoto}
      isLoading={isLoading}
      publishedAt={createdAt.toString()}
    />
  )
}

function Researcher({ informer, createdAt }: Props): JSX.Element {
  const { researcher, isLoading } = useResearcher({ address: informer })
  return (
    <HeaderFeedItem
      address={informer}
      name={researcher.name}
      proofPhoto={researcher.proofPhoto}
      isLoading={isLoading}
      publishedAt={createdAt.toString()}
    />
  )
}

function Developer({ informer, createdAt }: Props): JSX.Element {
  const { developer, isLoading } = useDeveloper({ address: informer })
  return (
    <HeaderFeedItem
      address={informer}
      name={developer.name}
      proofPhoto={developer.proofPhoto}
      isLoading={isLoading}
      publishedAt={createdAt.toString()}
    />
  )
}

function Contributor({ informer, createdAt }: Props): JSX.Element {
  const { contributor, isLoading } = useContributor({ address: informer })
  return (
    <HeaderFeedItem
      address={informer}
      name={contributor.name}
      proofPhoto={contributor.proofPhoto}
      isLoading={isLoading}
      publishedAt={createdAt.toString()}
    />
  )
}

function Activist({ informer, createdAt }: Props): JSX.Element {
  const { activist, isLoading } = useActivist({ address: informer })
  return (
    <HeaderFeedItem
      address={informer}
      name={activist.name}
      proofPhoto={activist.proofPhoto}
      isLoading={isLoading}
      publishedAt={createdAt.toString()}
    />
  )
}
