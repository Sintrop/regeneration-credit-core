import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { OffsetItem } from './OffsetItem/OffsetItem'
import { Loading } from '@renderer/components/Loading/Loading'
import { useTranslation } from 'react-i18next'

export function LatestOffsets(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'offsetsCount'
  })

  let offsetsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    offsetsIds = ids.reverse()
  }

  return (
    <div className="bg-card-2 rounded-2xl w-full">
      <div className="flex items-center justify-center h-10 border-b border-green-900 bg-card-1 rounded-t-2xl">
        <p className="text-sm text-green-1 mb-1">{t('feed.offsets')}</p>
      </div>

      {isLoading ? (
        <div className="w-[350px] my-5 flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-[500px]">
          {offsetsIds.length === 0 ? (
            <div className="items-center my-10 w-full">
              <p className="text-white text-center">{t('feed.noOffsets')}</p>
            </div>
          ) : (
            <>
              {offsetsIds.slice(0, 3).map((id) => (
                <OffsetItem id={id} key={id} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
