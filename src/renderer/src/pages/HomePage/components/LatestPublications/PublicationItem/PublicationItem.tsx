import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { useChainId, useReadContract } from 'wagmi'
import { PublicationHeader } from './PublicationHeader'
import { PublicationContent } from './PublicationContent'

interface Props {
  id: number
}

export function PublicationItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'publications',
    args: [id]
  })

  return (
    <div className="flex flex-col rounded-2xl p-3 bg-container-primary w-full">
      <PublicationHeader address={data && data[0]} />
      <PublicationContent
        burnedTokens={data && data[1]}
        description={data && data[2]}
        hashImage={data && data[3]}
      />
    </div>
  )
}
