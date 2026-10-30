import { useReadContract } from 'wagmi'
import { ContributionCertificate } from './ContributionCertificate/ContributionCertificate'
import { rcAbi, rcAddress } from '@renderer/services/contracts'
import { Loading } from '@renderer/components/Loading/Loading'
import { formatUnits } from 'viem'

interface Props {
  address: string
  name?: string
  userType: number
}

export function CertificatesTab({ address, name, userType }: Props): JSX.Element {
  const { data, isLoading } = useReadContract({
    address: rcAddress,
    abi: rcAbi,
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
