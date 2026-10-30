import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { userAbi, userAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useReadContract } from 'wagmi'
import { UserTypeAvailables, UserTypeContent } from '../AccountPage/components/UserTypeContent'
import { Loading } from '@renderer/components/Loading/Loading'
import { useParams } from 'react-router-dom'

export function UserDetailsPage(): JSX.Element {
  const params = useParams()
  const address = params?.address ? params?.address : ''
  const { t } = useTranslation()

  const { data, isLoading } = useReadContract({
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

  return (
    <ScreenPage pageTitle={t('account.userDetails')}>
      {isLoading ? (
        <div className="mx-auto overflow-hidden mt-10">
          <Loading />
        </div>
      ) : (
        <>
          {isDenied && (
            <div className="w-full h-16 bg-red-500 flex items-center justify-center mb-5 rounded-2xl max-w-[1024px]">
              <p className="font-semibod text-white text-xl">{t('account.invalidatedUser')}</p>
            </div>
          )}
          {userType && <UserTypeContent userType={userType} address={address} />}
        </>
      )}
    </ScreenPage>
  )
}
