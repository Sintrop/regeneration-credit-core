import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { UserTypeAvailables, UserTypeContent } from './components/UserTypeContent'

export function AccountPage(): JSX.Element {
  const navigate = useNavigate()
  const chainId = useChainId()
  const { address, isDisconnected } = useAccount()
  const { t } = useTranslation()

  const { data } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  const userType = data as UserTypeAvailables

  useEffect(() => {
    if (isDisconnected) {
      navigate('/', { replace: true })
    }
  }, [isDisconnected, navigate])

  return (
    <ScreenPage pageTitle={t('account')}>
      {userType && <UserTypeContent userType={userType} address={address as string} />}
    </ScreenPage>
  )
}
