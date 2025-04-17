import { useChainId, useReadContract } from 'wagmi'
import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { PublicationItem } from '@renderer/pages/HomePage/components/LatestPublications/PublicationItem/PublicationItem'

interface Props {
  address: string
  publicationsCount?: number
}

export function PublicationsTab({ address, publicationsCount }: Props): JSX.Element {
  if (!publicationsCount || publicationsCount === 0) return <div />

  const count = Array.from({ length: publicationsCount }, (_, i) => i)

  return (
    <div className="flex flex-col mt-5 max-w-[400px]">
      {count.map((count) => (
        <PubItem key={count} address={address} count={count} />
      ))}
    </div>
  )
}

interface PubItemProps {
  count: number
  address: string
}
function PubItem({ count, address }: PubItemProps): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'publicationIds',
    args: [address, count]
  })

  if (!data) return <div />

  return <PublicationItem id={data as number} />
}
