import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { userAbi, userAddress } from '@renderer/services/contracts'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAccount, useReadContract } from 'wagmi'
import { UserTypeAvailables, UserTypeContent } from './components/UserTypeContent'

export function AccountPage(): JSX.Element {
  const navigate = useNavigate()
  const { address, isDisconnected } = useAccount()
  const { t } = useTranslation()

  const { data } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'getUser',
    args: [address]
  })

  const { data: responseDenied } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'isDenied',
    args: [address]
  })

  const isDenied = responseDenied ? responseDenied : false

  const userType = data as UserTypeAvailables

  useEffect(() => {
    if (isDisconnected) {
      navigate('/', { replace: true })
    }
  }, [isDisconnected, navigate])

  return (
    <ScreenPage pageTitle={t('account.title')}>
      {isDenied && (
        <div className="w-full h-16 bg-red-500 flex items-center justify-center mb-5 rounded-2xl max-w-[1024px]">
          <p className="font-semibod text-white text-xl">{t('account.invalidatedUser')}</p>
        </div>
      )}
      {userType && <UserTypeContent userType={userType} address={address as string} profilePage />}
    </ScreenPage>
  )
}
