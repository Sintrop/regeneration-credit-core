import { useReadContract } from 'wagmi'
import { userAbi, userAddress } from '@renderer/services/contracts'
import { DelationContent } from './DelationContent'
import { Informer } from './Informer'
import { formatUnits } from 'viem'
import { VoteDelation } from './VoteDelation'

interface Props {
  id: number
  hideReported?: boolean
}

export function DelationItem({ id, hideReported }: Props): JSX.Element {
  const { data, refetch } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'delationsById',
    args: [id]
  })
  const delation = data as string[]

  if (delation) {
    return (
      <div className="flex flex-col p-3 w-full border-t border-green-900">
        <Informer
          createdAt={parseInt(formatUnits(BigInt(delation[5]), 0))}
          informer={delation[1]}
        />
        <DelationContent
          delationId={id}
          description={delation[4]}
          title={delation[3]}
          reported={delation[2]}
          thumbsUp={parseInt(formatUnits(BigInt(delation[6]), 0))}
          thumbsDown={parseInt(formatUnits(BigInt(delation[7]), 0))}
          hideReported={hideReported}
        />
        <VoteDelation
          delationId={id}
          thumbsUp={parseInt(formatUnits(BigInt(delation[6]), 0))}
          thumbsDown={parseInt(formatUnits(BigInt(delation[7]), 0))}
          refetchData={refetch}
        />
      </div>
    )
  }

  return <div />
}
