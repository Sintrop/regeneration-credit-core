/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { useAccount, useReadContract } from 'wagmi'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import {
  RegistrationUserType,
  UserRegistration
} from './components/UserRegistration/UserRegistration'
import { Vacancies } from './components/Vacancies'
import { useNavigate } from 'react-router-dom'
import { Invitation } from './components/Invitation'
import { InvitationProps } from '@renderer/types/invitation'
import { useMainnet } from '@renderer/hooks/useMainnet'

export function RegisterPage(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const mainnet = useMainnet()
  const { address, isDisconnected } = useAccount()
  const [name, setName] = useState('')
  const [userType, setUserType] = useState<RegistrationUserType>(0)
  const [invitationData, setInvitationData] = useState<InvitationProps>({} as InvitationProps)
  const [availableVacancie, setAvailableVacancie] = useState<boolean>(false)

  useEffect(() => {
    if (isDisconnected) {
      navigate('/', { replace: true })
    }
  }, [isDisconnected])

  const { data } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  const userTypeWalletConnected = parseInt(data as string)

  function handleGoToAccount(): void {
    navigate('/', { replace: true })
  }

  if (userTypeWalletConnected && userTypeWalletConnected !== 0) {
    return (
      <ScreenPage pageTitle={t('register.title')}>
        <div className="flex flex-col gap-5">
          <p className="text-white">{t('register.youAlreadyRegistered')}</p>
          <button
            className={`bg-green-btn rounded-2xl px-10 h-10 text-white font-semibold mt-10 w-fit hover:cursor-pointer`}
            onClick={handleGoToAccount}
          >
            {t('register.goToAccount')}
          </button>
        </div>
      </ScreenPage>
    )
  }

  return (
    <ScreenPage pageTitle={t('register.title')}>
      <div className="flex flex-col bg-green-card rounded-2xl p-3 w-[500px] mb-10">
        <p className="text-gray-300 text-sm">{t('register.walletConnected')}</p>
        <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-container-secondary w-full">
          {address && <Jazzicon className="w-8 h-8" address={address as string} />}
          <p className="text-white text-sm">{address}</p>
        </div>

        <p className="text-gray-300 text-sm mt-5">{t('register.selectUserType')}</p>
        <select
          className="w-full h-10 rounded-2xl bg-container-secondary px-5 text-white"
          value={userType}
          onChange={(e) => setUserType(parseInt(e.target.value) as RegistrationUserType)}
        >
          <option value={0}>{t('register.selectAnUserType')}</option>
          <option value={1}>{t('register.regenerator')}</option>
          <option value={2}>{t('register.inspector')}</option>
          <option value={3}>{t('register.researcher')}</option>
          <option value={4}>{t('register.developer')}</option>
          <option value={5}>{t('register.contributor')}</option>
          <option value={6}>{t('register.activist')}</option>
          <option value={7}>{t('register.supporter')}</option>
        </select>

        {userType !== 0 && (
          <>
            {userType !== 7 && (
              <div className="flex gap-5 flex-col mt-5">
                {userType !== 1 && (
                  <Vacancies userType={userType} onChange={setAvailableVacancie} />
                )}

                <Invitation onChangeInvitation={setInvitationData} userType={userType} />
              </div>
            )}

            <p className="text-gray-300 text-sm mt-5">{t('register.yourName')}</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 rounded-2xl bg-container-secondary px-5 text-white"
              placeholder={t('register.typeHere')}
            />

            <UserRegistration
              userType={userType}
              name={name}
              invitation={invitationData}
              availableVacancie={availableVacancie}
              success={handleGoToAccount}
            />
          </>
        )}
      </div>
    </ScreenPage>
  )
}
