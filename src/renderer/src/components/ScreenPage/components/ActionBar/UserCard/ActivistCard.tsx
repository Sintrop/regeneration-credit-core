import {
  activistAddress,
  activistAbi,
  sequoiaActivistAddress,
  sequoiaActivistAbi
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { ActivistProps } from '@renderer/types/activist'

export function ActivistCard(): JSX.Element {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? activistAddress : sequoiaActivistAddress,
    abi: chainId === 250225 ? activistAbi : sequoiaActivistAbi,
    functionName: 'getActivist',
    args: [address]
  })

  const activist = data as ActivistProps

  return (
    <BasicData
      address={address ? address : ''}
      name={activist ? activist?.name : ''}
      photoHash={activist ? activist?.proofPhoto : ''}
    />
  )
}
