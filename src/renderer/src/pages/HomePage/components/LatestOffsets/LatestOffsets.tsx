import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { OffsetItem } from './OffsetItem/OffsetItem'
import { Loading } from '@renderer/components/Loading/Loading'

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
    <div className="flex flex-col">
      <p className="text-white">{t('offsets')}</p>

      {isLoading ? (
        <div className="w-[400px] mt-5 flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {offsetsIds.slice(0, 5).map((id) => (
            <OffsetItem id={id} key={id} />
          ))}
        </div>
      )}
    </div>
  )
}
