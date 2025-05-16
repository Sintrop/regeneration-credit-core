import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'

export function RegisterButton(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const chainId = useChainId()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  function handleGoToRegister(): void {
    navigate('/register')
  }

  const userType = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0
  if (userType !== 0) return <div />

  return (
    <button
      className="px-4 h-10 rounded-2xl bg-green-primary text-white font-semibold hover:cursor-pointer"
      onClick={handleGoToRegister}
    >
      {t('register')}
    </button>
  )
}
