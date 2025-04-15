/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { sequoiaUserAbi, sequoiaUserAddress } from '@renderer/services/contracts'
import {
  RegistrationUserType,
  UserRegistration
} from './components/UserRegistration/UserRegistration'
import { Vacancies } from './components/Vacancies'
import { useNavigate } from 'react-router-dom'
import { Invitation } from './components/Invitation'
import { InvitationProps } from '@renderer/types/invitation'

export function RegisterPage(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address, isDisconnected } = useAccount()
  const [name, setName] = useState('')
  const [userType, setUserType] = useState<RegistrationUserType>(1)
  const [invitationData, setInvitationData] = useState<InvitationProps>({} as InvitationProps)
  const [availableVacancie, setAvailableVacancie] = useState<boolean>(false)

  useEffect(() => {
    if (isDisconnected) {
      navigate('/', { replace: true })
    }
  }, [isDisconnected])

  const { data } = useReadContract({
    address: chainId === 1600 ? sequoiaUserAddress : sequoiaUserAddress,
    abi: chainId === 1600 ? sequoiaUserAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  const userTypeWalletConnected = parseInt(data as string)

  function handleGoToAccount(): void {
    navigate('/account')
  }

  if (userTypeWalletConnected && userTypeWalletConnected !== 0) {
    return (
      <ScreenPage pageTitle={t('registration')}>
        <div className="flex flex-col gap-5">
          <p className="text-white">{t('youAlreadyRegistered')}</p>
          <button
            className={`bg-green-btn rounded-2xl px-10 h-10 text-white font-semibold mt-10 w-fit hover:cursor-pointer`}
            onClick={handleGoToAccount}
          >
            {t('goToAccount')}
          </button>
        </div>
      </ScreenPage>
    )
  }

  return (
    <ScreenPage pageTitle={t('registration')}>
      <div className="flex flex-col">
        <p className="text-gray-300 text-sm">{t('walletConnected')}</p>
        <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-container-secondary w-fit">
          {address && <Jazzicon className="w-8 h-8" address={address as string} />}
          <p className="text-white text-sm">{address}</p>
        </div>

        <p className="text-gray-300 text-sm mt-8">{t('selectUserType')}</p>
        <select
          className="w-[200px] h-10 rounded-2xl bg-container-secondary px-5 text-white"
          value={userType}
          onChange={(e) => setUserType(parseInt(e.target.value) as RegistrationUserType)}
        >
          <option value={1}>{t('regenerator')}</option>
          <option value={2}>{t('inspector')}</option>
          <option value={3}>{t('researcher')}</option>
          <option value={4}>{t('developer')}</option>
          <option value={5}>{t('contributor')}</option>
          <option value={6}>{t('activist')}</option>
          <option value={7}>{t('supporter')}</option>
        </select>

        {userType !== 7 && (
          <div className="flex gap-5 p-3 rounded-2xl bg-green-card mt-8 w-fit">
            {userType !== 1 && <Vacancies userType={userType} onChange={setAvailableVacancie} />}

            <Invitation onChangeInvitation={setInvitationData} userType={userType} />
          </div>
        )}

        <p className="text-gray-300 text-sm mt-8">{t('yourName')}</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-[450px] h-10 rounded-2xl bg-container-secondary px-5 text-white"
          placeholder={t('typeHere')}
        />

        <UserRegistration
          userType={userType}
          name={name}
          invitation={invitationData}
          availableVacancie={availableVacancie}
        />
      </div>
    </ScreenPage>
  )
}
