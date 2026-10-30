import { supporterAddress, supporterAbi } from '@renderer/services/contracts'
import { useAccount, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { SupporterProps } from '@renderer/types/supporter'
import { useCertificate } from '@renderer/domain/RegenerationCredit/useCases/useCertificate'

export function SupporterCard(): JSX.Element {
  const { address } = useAccount()

  const { tokens } = useCertificate({ address: address ? address : '' })

  const { data } = useReadContract({
    address: supporterAddress,
    abi: supporterAbi,
    functionName: 'getSupporter',
    args: [address]
  })

  const supporter = data as SupporterProps

  return (
    <BasicData
      address={address ? address : ''}
      name={supporter ? supporter?.name : ''}
      photoHash={supporter ? supporter?.profilePhoto : ''}
      userTypeName="supporter"
      indicator={tokens}
    />
  )
}
