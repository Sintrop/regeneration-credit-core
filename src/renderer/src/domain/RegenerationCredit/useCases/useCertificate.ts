import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

import { rcAbi, rcAddress } from '@renderer/services/contracts'

interface ReturnUseCertificateProps {
  isLoading: boolean
  isError: boolean
  tokens: number
  refetch: () => void
}

interface Props {
  address: string
}

export function useCertificate({ address }: Props): ReturnUseCertificateProps {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: rcAddress,
    abi: rcAbi,
    functionName: 'certificate',
    args: [address]
  })

  const tokensCertificated = data ? parseFloat(formatUnits(BigInt(data as string), 18)) : 0

  return {
    isError,
    isLoading,
    refetch,
    tokens: tokensCertificated
  }
}
