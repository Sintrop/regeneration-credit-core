import { useState } from 'react'
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

export function RegisterPage(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address } = useAccount()
  const [name, setName] = useState('')
  const [userType, setUserType] = useState<RegistrationUserType>(2)

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
      <div className="flex flex-wrap gap-10 w-full">
        <div className="flex flex-col max-w-[50%]">
          <p className="text-gray-300 text-sm">{t('walletConnected')}</p>
          <div className="flex items-center gap-5 px-5 py-2 rounded-2xl bg-container-secondary w-fit">
            <Jazzicon className="w-10 h-10" address={address as string} />
            <p className="text-white">{address}</p>
          </div>

          <p className="text-gray-300 text-sm mt-10">{t('yourName')}</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[450px] h-10 rounded-2xl bg-container-secondary px-5 text-white"
            placeholder={t('typeHere')}
          />

          <p className="text-gray-300 text-sm mt-10">{t('selectUserType')}</p>
          <select
            className="w-[450px] h-10 rounded-2xl bg-container-secondary px-5 text-white"
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

          <UserRegistration userType={userType} name={name} />
        </div>

        <div className="flex flex-col">
          <Vacancies userType={userType} />
        </div>
      </div>
    </ScreenPage>
  )
}
