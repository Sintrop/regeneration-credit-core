import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { PublicationItem } from './PublicationItem/PublicationItem'
import { Loading } from '@renderer/components/Loading/Loading'
import { useTranslation } from 'react-i18next'

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
    <div className="bg-card-2 rounded-2xl w-full">
      <div className="flex items-center justify-center h-10 border-b border-green-900 bg-card-1 rounded-t-2xl">
        <p className="text-sm text-green-1 mb-1">{t('publications')}</p>
      </div>
      {isLoading ? (
        <div className="mt-5 flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-[500px]">
          {publicationsIds.length === 0 ? (
            <div className="items-center my-10">
              <p className="text-white text-center">{t('noPublications')}</p>
            </div>
          ) : (
            <>
              {publicationsIds.map((id) => (
                <PublicationItem id={id} key={id} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
