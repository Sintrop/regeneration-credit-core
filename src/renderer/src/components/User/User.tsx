import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'

import { useMainnet } from '@renderer/hooks/useMainnet'
import { useRegenerator } from '@renderer/domain/Regenerator/useCases/useRegenerator'
import { useDeveloper } from '@renderer/domain/Developer/useCases/useDeveloper'
import { useInspector } from '@renderer/domain/Inspector/useCases/useInspector'
import { useResearcher } from '@renderer/domain/Researcher/useCases/useResearcher'
import { useContributor } from '@renderer/domain/Contributor/useCases/useContributor'
import { useActivist } from '@renderer/domain/Activist/useCases/useActivist'
import { AvatarArea } from './AvatarArea'

interface Props {
  address: string
  createdAt?: number
}
export function User({ address, createdAt }: Props): JSX.Element {
  const mainnet = useMainnet()
  const { data } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  const userType = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0

  if (userType === 1) return <Regenerator createdAt={createdAt} address={address} />
  if (userType === 2) return <Inspector createdAt={createdAt} address={address} />
  if (userType === 3) return <Researcher createdAt={createdAt} address={address} />
  if (userType === 4) return <Developer createdAt={createdAt} address={address} />
  if (userType === 5) return <Contributor createdAt={createdAt} address={address} />
  if (userType === 6) return <Activist createdAt={createdAt} address={address} />

  return <div />
}

function Regenerator({ address, createdAt }: Props): JSX.Element {
  const { regenerator, isLoading } = useRegenerator({ address: address })
  return (
    <AvatarArea
      address={address}
      name={regenerator.name}
      proofPhoto={regenerator.proofPhoto}
      isLoading={isLoading}
      createdAt={createdAt?.toString()}
    />
  )
}

function Inspector({ address, createdAt }: Props): JSX.Element {
  const { inspector, isLoading } = useInspector({ address: address })
  return (
    <AvatarArea
      address={address}
      name={inspector.name}
      proofPhoto={inspector.proofPhoto}
      isLoading={isLoading}
      createdAt={createdAt?.toString()}
    />
  )
}

function Researcher({ address, createdAt }: Props): JSX.Element {
  const { researcher, isLoading } = useResearcher({ address: address })
  return (
    <AvatarArea
      address={address}
      name={researcher.name}
      proofPhoto={researcher.proofPhoto}
      isLoading={isLoading}
      createdAt={createdAt?.toString()}
    />
  )
}

function Developer({ address, createdAt }: Props): JSX.Element {
  const { developer, isLoading } = useDeveloper({ address: address })
  return (
    <AvatarArea
      address={address}
      name={developer.name}
      proofPhoto={developer.proofPhoto}
      isLoading={isLoading}
      createdAt={createdAt?.toString()}
    />
  )
}

function Contributor({ address, createdAt }: Props): JSX.Element {
  const { contributor, isLoading } = useContributor({ address: address })
  return (
    <AvatarArea
      address={address}
      name={contributor.name}
      proofPhoto={contributor.proofPhoto}
      isLoading={isLoading}
      createdAt={createdAt?.toString()}
    />
  )
}

function Activist({ address, createdAt }: Props): JSX.Element {
  const { activist, isLoading } = useActivist({ address: address })
  return (
    <AvatarArea
      address={address}
      name={activist.name}
      proofPhoto={activist.proofPhoto}
      isLoading={isLoading}
      createdAt={createdAt?.toString()}
    />
  )
}
