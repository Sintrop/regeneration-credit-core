import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { ConnectionWalletButton } from './ConnectionWalletButton'
import { UserCard } from './UserCard/UserCard'
import {
  userAddress,
  sequoiaUserAddress,
  userAbi,
  sequoiaUserAbi
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { CentralIndicator } from './CentralIndicator/CentralIndicator'
import { Actions } from './Actions/Actions'

export function ActionBar(): JSX.Element {
  const { isConnected } = useAccount()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isConnected)
  }, [isConnected])

  return (
    <div
      className={`flex items-center w-screen bg-[#062c01] fixed bottom-0 left-0 px-20 py-4 duration-300 ${open ? 'h-32' : 'h-16'} z-30`}
    >
      {isConnected ? <YouAreConnected /> : <YouArentConnected />}
    </div>
  )
}

function YouAreConnected(): JSX.Element {
  const chainId = useChainId()
  const { address } = useAccount()
  const [indicator, setIndicator] = useState(0)

  const { data } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  const userType = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0

  return (
    <div className="w-full h-full flex items-center justify-between">
      <UserCard userType={userType} changeIndicator={setIndicator} />

      <CentralIndicator indicator={indicator} userType={userType} />

      <Actions userType={userType} />
    </div>
  )
}

function YouArentConnected(): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="w-full h-full flex items-center justify-between">
      <p className="text-white font-semibold">{t('youAreNotConnected')}</p>

      <ConnectionWalletButton />
    </div>
  )
}
