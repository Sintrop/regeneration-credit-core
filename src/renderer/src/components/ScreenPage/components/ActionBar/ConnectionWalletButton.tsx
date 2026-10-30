import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAccount, useConnect } from 'wagmi'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { Loading } from '@renderer/components/Loading/Loading'

export function ConnectionWalletButton(): JSX.Element {
  const { t } = useTranslation()
  const { address, status, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const navigate = useNavigate()

  /** Connects when signed out; once connected, opens the user's own profile. */
  function handleClickConnectButton(): void {
    if (status === 'disconnected') connect({ connector: connectors[0] })
    else if (status === 'connected') navigate('/account')
  }

  return (
    <div className="flex items-center gap-5">
      <button
        className="min-w-[160px] px-4 h-9 rounded-xl bg-green-primary text-green-secondary font-semibold hover:cursor-pointer flex items-center justify-center gap-3 disabled:bg-blue-primary/50"
        onClick={handleClickConnectButton}
        title={status === 'connected' ? t('shell.myProfile') : undefined}
        disabled={isConnecting || isReconnecting}
      >
        {isConnecting || isReconnecting ? (
          <div className="flex w-full h-full justify-center items-center">
            <Loading size={20} />
          </div>
        ) : (
          <>
            {status === 'disconnected' && t('actionBar.connectWallet')}
            {status === 'connected' && (
              <>
                {address && <Jazzicon className="w-7 h-7" address={address} />}
                <p className="truncate text-ellipsis max-w-[100px]">{address}</p>
              </>
            )}
          </>
        )}
      </button>
    </div>
  )
}
