import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

import { useMainnet } from '@renderer/hooks/useMainnet'
import { rcAbi, rcAddress, sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'

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
  const mainnet = useMainnet()
  const { data, isLoading, isError, refetch } = useReadContract({
    address: mainnet ? rcAddress : sequoiaRcAddress,
    abi: mainnet ? rcAbi : sequoiaRcAbi,
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
