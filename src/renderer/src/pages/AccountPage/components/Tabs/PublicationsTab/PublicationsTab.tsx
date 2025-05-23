import { useChainId, useReadContract } from 'wagmi'
import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { PublicationItem } from '@renderer/pages/HomePage/components/FeedTabs/LatestPublications/PublicationItem/PublicationItem'
import { useTranslation } from 'react-i18next'
import { Loading } from '@renderer/components/Loading/Loading'
import { formatUnits } from 'viem'

interface Props {
  address: string
}

export function PublicationsTab({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'getPublications',
    args: [address]
  })

  if (isLoading) {
    return (
      <div className="mt-5 mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  const publicationsIds = data ? (data as string[]) : []

  if (publicationsIds.length === 0) {
    return <p className="mt-5 text-white">{t('noPublications')}</p>
  }

  return (
    <div className="flex flex-col mt-5 max-w-[400px] gap-5">
      {publicationsIds.reverse().map((item) => (
        <PubItem key={item} id={item} />
      ))}
    </div>
  )
}

interface PubItemProps {
  id: string
}
function PubItem({ id }: PubItemProps): JSX.Element {

  return <PublicationItem id={parseInt(formatUnits(BigInt(id), 0))} />
}
