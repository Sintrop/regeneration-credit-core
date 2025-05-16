import { useTranslation } from 'react-i18next'
import { useAccount, useConnect } from 'wagmi'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { Loading } from '@renderer/components/Loading/Loading'
import { RegisterButton } from './RegisterButton'

export function ConnectionWalletButton(): JSX.Element {
  const { t } = useTranslation()
  const { address, status, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()

  function handleClickConnectButton(): void {
    if (status === 'disconnected') {
      connect({ connector: connectors[0] })
    }
  }

  return (
    <div className="flex items-center gap-5">
      {status === 'connected' && <RegisterButton />}

      <button
        className="w-[180px] px-4 h-10 rounded-2xl bg-blue-primary text-white font-semibold hover:cursor-pointer flex items-center justify-center gap-3 disabled:bg-blue-primary/50"
        onClick={handleClickConnectButton}
        disabled={isConnecting || isReconnecting}
      >
        {isConnecting || isReconnecting ? (
          <div className="flex w-full h-full justify-center items-center">
            <Loading size={20} />
          </div>
        ) : (
          <>
            {status === 'disconnected' && t('connectWallet')}
            {status === 'connected' && (
              <>
                {address && <Jazzicon className="w-7 h-7" address={address} />}
                <p className="truncate text-ellipsis text-white max-w-[100px]">{address}</p>
              </>
            )}
          </>
        )}
      </button>
    </div>
  )
}
