import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { PublicationItem } from './PublicationItem/PublicationItem'
import { Loading } from '@renderer/components/Loading/Loading'

export function LatestPublications(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'publicationsCount'
  })

  let publicationsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    publicationsIds = ids.reverse()
  }

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('publications')}</p>

      {isLoading ? (
        <div className="w-[400px] mt-5 flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-[400px]">
          {publicationsIds.slice(0, 5).map((id) => (
            <PublicationItem id={id} key={id} />
          ))}
        </div>
      )}
    </div>
  )
}
