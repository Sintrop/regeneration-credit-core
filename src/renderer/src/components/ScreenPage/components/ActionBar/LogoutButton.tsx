import { MdLogout } from 'react-icons/md'
import { useAccount, useDisconnect } from 'wagmi'

export function LogoutButton(): JSX.Element {
  const { status } = useAccount()
  const { disconnect } = useDisconnect()

  function handleClickDisconnectButton(): void {
    if (status !== 'connected') return
    disconnect()
  }

  if (status !== 'connected') return <div />

  return (
    <button
      className="px-2 h-8 rounded-2xl text-white font-semibold duration-300 hover:cursor-pointer hover:bg-green-card"
      onClick={handleClickDisconnectButton}
    >
      <MdLogout color="white" size={20} />
    </button>
  )
}
