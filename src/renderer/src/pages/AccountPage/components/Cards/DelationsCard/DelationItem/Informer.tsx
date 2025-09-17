import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { useRegenerator } from '@renderer/domain/Regenerator/useCases/useRegenerator'
import { useDeveloper } from '@renderer/domain/Developer/useCases/useDeveloper'
import { useInspector } from '@renderer/domain/Inspector/useCases/useInspector'
import { useResearcher } from '@renderer/domain/Researcher/useCases/useResearcher'
import { useContributor } from '@renderer/domain/Contributor/useCases/useContributor'
import { useActivist } from '@renderer/domain/Activist/useCases/useActivist'
import { InformerContent } from './InformerContent'

interface Props {
  informer: string
}
export function Informer({ informer }: Props): JSX.Element {
  const mainnet = useMainnet()
  const { data } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [informer]
  })

  const userType = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0

  if (userType === 1) return <Regenerator informer={informer} />
  if (userType === 2) return <Inspector informer={informer} />
  if (userType === 3) return <Researcher informer={informer} />
  if (userType === 4) return <Developer informer={informer} />
  if (userType === 5) return <Contributor informer={informer} />
  if (userType === 6) return <Activist informer={informer} />

  return <div />
}

function Regenerator({ informer }: Props): JSX.Element {
  const { regenerator, isLoading } = useRegenerator({ address: informer })
  return (
    <InformerContent
      address={informer}
      name={regenerator.name}
      proofPhoto={regenerator.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Inspector({ informer }: Props): JSX.Element {
  const { inspector, isLoading } = useInspector({ address: informer })
  return (
    <InformerContent
      address={informer}
      name={inspector.name}
      proofPhoto={inspector.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Researcher({ informer }: Props): JSX.Element {
  const { researcher, isLoading } = useResearcher({ address: informer })
  return (
    <InformerContent
      address={informer}
      name={researcher.name}
      proofPhoto={researcher.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Developer({ informer }: Props): JSX.Element {
  const { developer, isLoading } = useDeveloper({ address: informer })
  return (
    <InformerContent
      address={informer}
      name={developer.name}
      proofPhoto={developer.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Contributor({ informer }: Props): JSX.Element {
  const { contributor, isLoading } = useContributor({ address: informer })
  return (
    <InformerContent
      address={informer}
      name={contributor.name}
      proofPhoto={contributor.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Activist({ informer }: Props): JSX.Element {
  const { activist, isLoading } = useActivist({ address: informer })
  return (
    <InformerContent
      address={informer}
      name={activist.name}
      proofPhoto={activist.proofPhoto}
      isLoading={isLoading}
    />
  )
}
