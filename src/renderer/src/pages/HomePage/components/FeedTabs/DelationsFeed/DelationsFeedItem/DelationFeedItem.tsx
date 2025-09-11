import { useReadContract } from 'wagmi'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { DelationFeedContent } from './DelationFeedContent'
import { useMainnet } from '@renderer/hooks/useMainnet'
import { Informer } from './Informer'

interface Props {
  id: number
}

export function DelationFeedItem({ id }: Props): JSX.Element {
  const mainnet = useMainnet()
  const { data } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'delationsById',
    args: [id]
  })
  const delation = data as string[]

  if (delation) {
    return (
      <div className="flex flex-col p-3 w-full border-t border-green-900">
        <Informer createdAt={10000} informer={delation[1]} />
        <DelationFeedContent
          delationId={id}
          description={delation[4]}
          title={delation[3]}
          reported={delation[2]}
        />
      </div>
    )
  }

  return <div />
}
