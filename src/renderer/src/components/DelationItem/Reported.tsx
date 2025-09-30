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
import { ReportedContent } from './ReportedContent'

interface Props {
  reported: string
}
export function Reported({ reported }: Props): JSX.Element {
  const mainnet = useMainnet()
  const { data } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [reported]
  })

  const userType = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0

  if (userType === 1) return <Regenerator reported={reported} />
  if (userType === 2) return <Inspector reported={reported} />
  if (userType === 3) return <Researcher reported={reported} />
  if (userType === 4) return <Developer reported={reported} />
  if (userType === 5) return <Contributor reported={reported} />
  if (userType === 6) return <Activist reported={reported} />

  return <div />
}

function Regenerator({ reported }: Props): JSX.Element {
  const { regenerator, isLoading } = useRegenerator({ address: reported })
  return (
    <ReportedContent
      address={reported}
      name={regenerator.name}
      proofPhoto={regenerator.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Inspector({ reported }: Props): JSX.Element {
  const { inspector, isLoading } = useInspector({ address: reported })
  return (
    <ReportedContent
      address={reported}
      name={inspector.name}
      proofPhoto={inspector.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Researcher({ reported }: Props): JSX.Element {
  const { researcher, isLoading } = useResearcher({ address: reported })
  return (
    <ReportedContent
      address={reported}
      name={researcher.name}
      proofPhoto={researcher.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Developer({ reported }: Props): JSX.Element {
  const { developer, isLoading } = useDeveloper({ address: reported })
  return (
    <ReportedContent
      address={reported}
      name={developer.name}
      proofPhoto={developer.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Contributor({ reported }: Props): JSX.Element {
  const { contributor, isLoading } = useContributor({ address: reported })
  return (
    <ReportedContent
      address={reported}
      name={contributor.name}
      proofPhoto={contributor.proofPhoto}
      isLoading={isLoading}
    />
  )
}

function Activist({ reported }: Props): JSX.Element {
  const { activist, isLoading } = useActivist({ address: reported })
  return (
    <ReportedContent
      address={reported}
      name={activist.name}
      proofPhoto={activist.proofPhoto}
      isLoading={isLoading}
    />
  )
}
