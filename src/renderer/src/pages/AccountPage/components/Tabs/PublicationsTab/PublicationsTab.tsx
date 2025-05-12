import { useChainId, useReadContract } from 'wagmi'
import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { PublicationItem } from '@renderer/pages/HomePage/components/FeedTabs/LatestPublications/PublicationItem/PublicationItem'
import { useTranslation } from 'react-i18next'

interface Props {
  address: string
  publicationsCount?: number
}

export function PublicationsTab({ address, publicationsCount }: Props): JSX.Element {
  const { t } = useTranslation()

  if (!publicationsCount || publicationsCount === 0) {
    return (
      <div className="flex flex-col items-center mt-5">
        <p className="text-white">{t("thereAren'tAnyPublication")}</p>
      </div>
    )
  }

  const count = Array.from({ length: publicationsCount }, (_, i) => i)

  return (
    <div className="flex flex-col mt-5 max-w-[400px] gap-5">
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
