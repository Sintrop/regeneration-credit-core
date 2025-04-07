import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { SupporterProps } from '@renderer/types/supporter'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  address?: string
  isLoading?: boolean
}

export function PublicationHeader({ address }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'getSupporter',
    args: [address]
  })

  const supporter = data as SupporterProps

  return (
    <div className="flex items-center gap-3">
      {address && <Jazzicon address={address} className="w-10 h-10" />}

      <div className="flex flex-col">
        <p className="text-white">{supporter ? supporter?.name : address}</p>
      </div>
    </div>
  )
}
