import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { useChainId, useReadContract } from 'wagmi'
import { OffsetHeader } from './OffsetHeader'
import { OffsetContent } from './OffsetContent'
import { ContributionImpact } from '../../ContributionImpact/ContributionImpact'
import { formatUnits } from 'viem'

interface Props {
  id: number
}

export function OffsetItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'offsets',
    args: [id]
  })

  return (
    <div className="flex flex-col p-3 w-full border-t-4 border-green-900">
      <OffsetHeader address={data && data[0]} publishedAt={data && data[1]} />
      <OffsetContent
        burnedTokens={data && data[2]}
        calculatorItemId={data && data[3]}
        message={data && data[4]}
      />
      <ContributionImpact burnedTokens={data ? parseFloat(formatUnits(BigInt(data[2]), 18)) : 0} />
    </div>
  )
}
