import { Loading } from '@renderer/components/Loading/Loading'
import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { InvitationProps } from '@renderer/types/invitation'
import { useTranslation } from 'react-i18next'
import { useAccount, useReadContract } from 'wagmi'

interface Props {
  userType: number
  onChangeInvitation: (invitationData: InvitationProps) => void
}
export function Invitation({ onChangeInvitation, userType }: Props): JSX.Element {
  const { t } = useTranslation()
  const mainnet = useMainnet()
  const { address } = useAccount()
  const { data, isLoading } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'getInvitation',
    args: [address]
  })

  const invitationData = data as InvitationProps
  if (invitationData) {
    onChangeInvitation(invitationData)
  }

  return (
    <div className="flex flex-col">
      <p className="text-gray-300 text-sm">{t('register.invitation')}</p>
      <div className="flex flex-col w-full p-3 rounded-2xl bg-container-secondary overflow-hidden">
        <p className="text-gray-300 text-sm">{t('register.descInvitation')}</p>

        {isLoading ? (
          <Loading size={50} />
        ) : (
          <>
            {invitationData && (
              <div className="flex flex-col">
                <p className="text-white">
                  {invitationData?.userType === 0
                    ? t('register.youDontHaveAnInvitation')
                    : t('register.youHaveInvitation')}
                </p>

                {invitationData?.userType !== 0 && (
                  <>
                    <p className="text-gray-300 text-sm mt-3">{t('register.activist')}</p>
                    <p className="text-white">{invitationData?.inviter}</p>

                    <p className="text-gray-300 text-sm mt-3">{t('register.toRegisterAs')}</p>
                    <UserTypeToText className="text-white" userType={invitationData?.userType} />

                    {invitationData?.userType !== userType && (
                      <p className="text-red-500 mt-3">{t('register.tryDiferentUser')}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
