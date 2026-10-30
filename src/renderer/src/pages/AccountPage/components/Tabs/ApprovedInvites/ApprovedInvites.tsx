import { Loading } from '@renderer/components/Loading/Loading'
import { activistAbi, activistAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { ApprovedItem } from './ApprovedItem/ApprovedItem'

interface Props {
  address: string
}

export function ApprovedInvites({ address }: Props): JSX.Element {
  const { data, isLoading } = useReadContract({
    address: activistAddress,
    abi: activistAbi,
    functionName: 'activistApprovedInvites',
    args: [address]
  })

  let positions: number[] = []
  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))
    const array = Array.from({ length: count }, (_, i) => i)
    positions = array.reverse()
  }

  if (isLoading) {
    return (
      <div className="mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-col mt-5 gap-3">
      {positions.map((item) => (
        <ApprovedItem key={item} address={address} position={item} />
      ))}
    </div>
  )
}
