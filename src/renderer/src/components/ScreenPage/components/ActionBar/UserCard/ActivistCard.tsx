import { activistAddress, activistAbi } from '@renderer/services/contracts'
import { useAccount, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { ActivistProps } from '@renderer/types/activist'
import { formatUnits } from 'viem'
import { useUserContext } from '@renderer/hooks/useUserContext'

export function ActivistCard(): JSX.Element {
  const { setEraPool } = useUserContext()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: activistAddress,
    abi: activistAbi,
    functionName: 'getActivist',
    args: [address]
  })

  const activist = data as ActivistProps

  if (activist) {
    setEraPool(parseInt(formatUnits(BigInt(activist.pool.currentEra), 0)))
  }

  return (
    <BasicData
      address={address ? address : ''}
      name={activist ? activist?.name : ''}
      photoHash={activist ? activist?.proofPhoto : ''}
      userTypeName="activist"
      indicator={activist ? parseInt(formatUnits(BigInt(activist.pool.level), 0)) : 0}
    />
  )
}
