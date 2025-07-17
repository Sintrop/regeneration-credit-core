import { useChainId, useReadContract } from 'wagmi'
import { ContributionCertificate } from './ContributionCertificate/ContributionCertificate'
import { rcAbi, rcAddress, sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'

interface Props {
  address: string
  name?: string
  userType: number
}

export function CertificatesCard({ address, name, userType }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
    abi: chainId === 250225 ? rcAbi : sequoiaRcAbi,
    functionName: 'certificate',
    args: [address]
  })

  const certificate = data as string
  const formatedCertificate = certificate ? formatUnits(BigInt(certificate), 18) : '0'

  if (userType === 7) {
    return (
      <div className="mt-5">
        <ContributionCertificate
          certificateTokens={formatedCertificate}
          name={name}
          address={address}
          userType={userType}
        />
      </div>
    )
  }

  return <div></div>
}
