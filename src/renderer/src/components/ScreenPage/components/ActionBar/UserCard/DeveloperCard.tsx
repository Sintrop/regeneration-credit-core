import {
  developerAddress,
  sequoiaDeveloperAddress,
  developerAbi,
  sequoiaDeveloperAbi
} from '@renderer/services/contracts'
import { DeveloperProps } from '@renderer/types/developer'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'

export function DeveloperCard(): JSX.Element {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getDeveloper',
    args: [address]
  })

  const developer = data as DeveloperProps

  return (
    <BasicData
      address={address ? address : ''}
      name={developer ? developer?.name : ''}
      photoHash={developer ? developer?.proofPhoto : ''}
    />
  )
}
