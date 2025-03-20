import { useTranslation } from 'react-i18next'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { MdLogout } from 'react-icons/md'

export function ConnectionWalletButton(): JSX.Element {
  const { t } = useTranslation()
  const { address, status, addresses } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  function handleClickConnectButton(): void {
    console.log(addresses)
    if (status === 'disconnected') {
      connect({ connector: connectors[0] })
    }
  }

  function handleClickDisconnectButton(): void {
    if (status !== 'connected') return
    disconnect()
  }

  return (
    <div className="flex items-center gap-5">
      <button
        className="px-5 h-10 rounded-2xl bg-green-secondary text-white font-semibold hover:cursor-pointer"
        onClick={handleClickConnectButton}
      >
        {status === 'disconnected' && t('connectWallet')}
        {status === 'connected' && (
          <p className="truncate text-ellipsis text-white max-w-[100px]">{address}</p>
        )}
      </button>

      {status === 'connected' && (
        <button
          className="px-4 h-10 rounded-2xl bg-green-secondary text-white font-semibold hover:cursor-pointer"
          onClick={handleClickDisconnectButton}
        >
          <MdLogout color="white" size={25}/>
        </button>
      )}
    </div>
  )
}
