import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdCheckCircle, MdError } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useAccount, useConnect } from 'wagmi'

import { ByteCounter } from '@renderer/components/ByteCounter/ByteCounter'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'
import { useRegistrationRequirements } from '@renderer/hooks/useRegistrationRequirements'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { clampToBytes } from '@renderer/utils/byteLength'
import {
  RegistrationUserType,
  UserRegistration
} from './components/UserRegistration/UserRegistration'

const TYPES: RegistrationUserType[] = [1, 2, 3, 4, 5, 6, 7]
/** RegeneratorRules/…/SupporterRules MAX_NAME_LENGTH */
const MAX_NAME_BYTES = 50

function Requirement({
  ok,
  title,
  children
}: {
  ok: boolean
  title: string
  children?: React.ReactNode
}): JSX.Element {
  return (
    <div className="flex gap-3">
      {ok ? (
        <MdCheckCircle className="shrink-0 mt-0.5 text-green-primary" size={20} />
      ) : (
        <MdError className="shrink-0 mt-0.5 text-amber-300" size={20} />
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-white text-sm font-semibold">{title}</p>
        {children}
      </div>
    </div>
  )
}

function Requirements({ userType }: { userType: number }): JSX.Element {
  const { t } = useTranslation()
  const { address } = useAccount()
  const req = useRegistrationRequirements(address, userType)

  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
      <p className="text-white font-bold">{t('registerPage.requirements')}</p>
      {req.isLoading ? (
        <div className="h-24 rounded-xl bg-card-secondary animate-pulse" />
      ) : (
        <>
          <Requirement
            ok={req.invitationOk}
            title={
              req.needInvitation
                ? t('registerPage.invitationNeeded')
                : t('registerPage.noInvitationNeeded')
            }
          >
            {req.invitation ? (
              <>
                <UserBadge address={req.invitation.inviter} label={t('registerPage.invitedBy')} />
                <p className="text-gray-300 text-xs">
                  {t('register.toRegisterAs')}:{' '}
                  <UserTypeToText
                    userType={req.invitation.userType}
                    className="inline text-white font-semibold"
                  />
                </p>
                {req.needInvitation && !req.invitationOk && (
                  <p className="text-amber-300 text-xs">{t('register.tryDiferentUser')}</p>
                )}
              </>
            ) : (
              req.needInvitation && (
                <p className="text-gray-400 text-xs">{t('registerPage.askInvitation')}</p>
              )
            )}
          </Requirement>
          {req.invitation && (
            <Requirement ok={req.inviterOk} title={t('registerPage.inviterStanding')}>
              {!req.inviterOk && (
                <p className="text-amber-300 text-xs">
                  {req.inviterDenied
                    ? t('registerPage.inviterDenied')
                    : t('registerPage.inviterPenalties', { count: req.inviterPenalties })}
                </p>
              )}
            </Requirement>
          )}
          <Requirement ok={req.vacanciesOk} title={t('registerPage.vacancies')}>
            <p className="text-gray-400 text-xs">
              {userType === 1 || userType === 7
                ? t('registerPage.noVacancyLimit')
                : t('registerPage.vacanciesCount', { count: req.vacancies ?? 0 })}
            </p>
          </Requirement>
        </>
      )}
    </section>
  )
}

export function RegisterPage(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { userType: registeredType, refetchUserType } = useUserContext()
  const [userType, setUserType] = useState<RegistrationUserType>(0)
  const [name, setName] = useState('')
  const req = useRegistrationRequirements(address, userType)

  if (!isConnected) {
    return (
      <ScreenPage pageTitle={t('register.title')}>
        <div className="max-w-[720px] mx-auto p-8 rounded-2xl bg-card-primary flex flex-col items-center gap-4 text-center">
          <p className="text-gray-300">{t('registerPage.connectFirst')}</p>
          <button
            className="h-11 px-6 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer"
            onClick={() => connect({ connector: connectors[0] })}
          >
            {t('actionBar.connectWallet')}
          </button>
        </div>
      </ScreenPage>
    )
  }

  if (registeredType > 0) {
    return (
      <ScreenPage pageTitle={t('register.title')}>
        <div className="max-w-[720px] mx-auto p-8 rounded-2xl bg-card-primary flex flex-col items-center gap-4 text-center">
          <p className="text-white font-semibold">{t('register.youAlreadyRegistered')}</p>
          <UserTypeToText userType={registeredType} className="text-green-primary" />
          <button
            className="h-11 px-6 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer"
            onClick={() => navigate('/account')}
          >
            {t('register.goToAccount')}
          </button>
        </div>
      </ScreenPage>
    )
  }

  function success(): void {
    refetchUserType()
    navigate('/account', { replace: true })
  }

  return (
    <ScreenPage pageTitle={t('register.title')}>
      <div className="max-w-[1000px] mx-auto flex gap-6 items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
            <div>
              <p className="text-white text-lg font-bold">{t('registerPage.chooseType')}</p>
              <p className="text-gray-300 text-sm">{t('registerPage.chooseTypeHint')}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`p-4 rounded-xl text-left flex flex-col gap-1 hover:cursor-pointer ${
                    userType === type
                      ? 'bg-green-primary/15 ring-2 ring-green-primary'
                      : 'bg-card-secondary hover:ring-1 hover:ring-green-primary/50'
                  }`}
                >
                  <UserTypeToText userType={type} className="text-white font-bold" />
                  <span className="text-gray-400 text-xs">
                    {t(`registerPage.typeDescription.${type}`)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {userType !== 0 && (
            <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-gray-300 text-sm">{t('register.yourName')}</span>
                <input
                  value={name}
                  onChange={(event) => setName(clampToBytes(event.target.value, MAX_NAME_BYTES))}
                  placeholder={t('register.typeHere')}
                  className="h-11 px-3 rounded-xl bg-card-secondary text-white outline-none focus:ring-1 focus:ring-green-primary"
                />
                <ByteCounter text={name} max={MAX_NAME_BYTES} />
              </label>
              <UserRegistration
                key={userType}
                userType={userType}
                name={name}
                requirementsMet={req.requirementsMet}
                success={success}
              />
            </section>
          )}
        </div>

        <aside className="w-[320px] shrink-0 flex flex-col gap-4">
          <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-2">
            <p className="text-gray-400 text-xs">{t('register.walletConnected')}</p>
            {address && <UserBadge address={address} />}
          </section>
          {userType !== 0 && <Requirements userType={userType} />}
        </aside>
      </div>
    </ScreenPage>
  )
}
