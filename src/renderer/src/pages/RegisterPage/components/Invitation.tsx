import { sequoiaUserAbi, sequoiaUserAddress } from '@renderer/services/contracts'
import { InvitationProps } from '@renderer/types/invitation'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId, useReadContract } from 'wagmi'

export function Invitation(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address } = useAccount()
  const { data } = useReadContract({
    address: chainId === 1600 ? sequoiaUserAddress : sequoiaUserAddress,
    abi: chainId === 1600 ? sequoiaUserAbi : sequoiaUserAbi,
    functionName: 'getInvitation',
    args: [address]
  })

  const invitationData = data as InvitationProps

  return (
    <div className="flex flex-col">
      <p className="text-gray-300 text-sm">{t('invitation')}</p>
      <div className="flex flex-col p-3 rounded-2xl bg-container-secondary ">
        <p className="text-gray-300 text-sm">{t('descInvitation')}</p>

        {invitationData ? (
          <div className="flex flex-col">
            <p className="text-white">{t('youHaveInvitation')}</p>
            <p className="text-gray-300 text-sm mt-3">{t('activist')}</p>
            <p className="text-white">{invitationData?.inviter}</p>

            <p className="text-gray-300 text-sm mt-3">{t('toRegisterAs')}</p>
            <p className="text-white">{invitationData?.userType}</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-white">{t('youDontHaveAnInvitation')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
