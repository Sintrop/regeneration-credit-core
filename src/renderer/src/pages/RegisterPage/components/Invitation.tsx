import { Loading } from '@renderer/components/Loading/Loading'
import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'
import { sequoiaUserAbi, sequoiaUserAddress } from '@renderer/services/contracts'
import { InvitationProps } from '@renderer/types/invitation'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId, useReadContract } from 'wagmi'

interface Props {
  userType: number
  onChangeInvitation: (invitationData: InvitationProps) => void
}
export function Invitation({ onChangeInvitation, userType }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address } = useAccount()
  const { data, isLoading } = useReadContract({
    address: chainId === 1600 ? sequoiaUserAddress : sequoiaUserAddress,
    abi: chainId === 1600 ? sequoiaUserAbi : sequoiaUserAbi,
    functionName: 'getInvitation',
    args: [address]
  })

  const invitationData = data as InvitationProps
  if (invitationData) {
    onChangeInvitation(invitationData)
  }

  return (
    <div className="flex flex-col">
      <p className="text-gray-300 text-sm">{t('invitation')}</p>
      <div className="flex flex-col w-full p-3 rounded-2xl bg-container-secondary overflow-hidden">
        <p className="text-gray-300 text-sm">{t('descInvitation')}</p>

        {isLoading ? (
          <Loading size={50} />
        ) : (
          <>
            {invitationData && (
              <div className="flex flex-col">
                <p className="text-white">
                  {invitationData?.userType === 0
                    ? t('youDontHaveAnInvitation')
                    : t('youHaveInvitation')}
                </p>

                {invitationData?.userType !== 0 && (
                  <>
                    <p className="text-gray-300 text-sm mt-3">{t('activist')}</p>
                    <p className="text-white">{invitationData?.inviter}</p>

                    <p className="text-gray-300 text-sm mt-3">{t('toRegisterAs')}</p>
                    <UserTypeToText className="text-white" userType={invitationData?.userType} />

                    {invitationData?.userType !== userType && (
                      <p className="text-red-500 mt-3">
                        {t(
                          'youAreTryingToRegisterWithADifferentUserTypeThanTheOneYouWereInvitedTo'
                        )}
                      </p>
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
