import { useChainId, useReadContract } from 'wagmi'
import { ContributionCertificate } from './ContributionCertificate/ContributionCertificate'
import { rcAbi, rcAddress, sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'
import { Loading } from '@renderer/components/Loading/Loading'
import { formatUnits } from 'viem'

interface Props {
  address: string
  name?: string
  userType: number
}

export function CertificatesTab({ address, name, userType }: Props): JSX.Element {
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
    abi: chainId === 250225 ? rcAbi : sequoiaRcAbi,
    functionName: 'certificate',
    args: [address]
  })

  const certificate = data as string
  const formatedCertificate = certificate ? formatUnits(BigInt(certificate), 18) : '0'

  if (isLoading) {
    return (
      <div className="mx-auto overflow-hidden mt-5">
        <Loading />
      </div>
    )
  }

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
