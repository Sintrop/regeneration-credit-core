import { useTranslation } from 'react-i18next'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { MdLogout } from 'react-icons/md'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useNavigate } from 'react-router-dom'

export function ConnectionWalletButton(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { address, status } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  function handleClickConnectButton(): void {
    if (status === 'disconnected') {
      connect({ connector: connectors[0] })
    }
    if (status === 'connected') {
      navigate('/account')
    }
  }

  function handleClickDisconnectButton(): void {
    if (status !== 'connected') return
    disconnect()
  }

  return (
    <div className="flex items-center gap-5">
      <button
        className="w-[180px] px-4 h-10 rounded-2xl bg-green-secondary text-white font-semibold hover:cursor-pointer flex items-center gap-3"
        onClick={handleClickConnectButton}
      >
        {status === 'disconnected' && t('connectWallet')}
        {status === 'connected' && (
          <>
            <Jazzicon className="w-7 h-7" address={address} />
            <p className="truncate text-ellipsis text-white max-w-[100px]">{address}</p>
          </>
        )}
      </button>

      {status === 'connected' && (
        <button
          className="px-4 h-10 rounded-2xl bg-green-secondary text-white font-semibold hover:cursor-pointer"
          onClick={handleClickDisconnectButton}
        >
          <MdLogout color="white" size={25} />
        </button>
      )}
    </div>
  )
}
