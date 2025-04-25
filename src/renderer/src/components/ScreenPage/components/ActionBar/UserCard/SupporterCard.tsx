import {
  supporterAddress,
  supporterAbi,
  sequoiaSupporterAddress,
  sequoiaSupporterAbi
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { SupporterProps } from '@renderer/types/supporter'

export function SupporterCard(): JSX.Element {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'getSupporter',
    args: [address]
  })

  const supporter = data as SupporterProps

  return (
    <BasicData
      address={address ? address : ''}
      name={supporter ? supporter?.name : ''}
      photoHash={supporter ? supporter?.profilePhoto : ''}
    />
  )
}
