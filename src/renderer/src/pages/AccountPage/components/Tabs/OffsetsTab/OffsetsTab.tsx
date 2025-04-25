import { useChainId, useReadContract } from 'wagmi'
import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { OffsetItem } from '@renderer/pages/HomePage/components/LatestOffsets/OffsetItem/OffsetItem'

interface Props {
  address: string
  offsetsCount?: number
}

export function OffsetsTab({ address, offsetsCount }: Props): JSX.Element {
  const { t } = useTranslation()

  if (!offsetsCount || offsetsCount === 0) {
    return (
      <div className="flex flex-col items-center mt-5">
        <p className="text-white">{t("thereAren'tAnyOffsets")}</p>
      </div>
    )
  }

  const count = Array.from({ length: offsetsCount }, (_, i) => i)

  return (
    <div className="flex flex-col mt-5 max-w-[400px] gap-5">
      {count.map((count) => (
        <OffItem key={count} address={address} count={count} />
      ))}
    </div>
  )
}

interface OffItemProps {
  count: number
  address: string
}
function OffItem({ count, address }: OffItemProps): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'offsetIds',
    args: [address, count]
  })

  if (!data) return <div />

  return <OffsetItem id={data as number} />
}
