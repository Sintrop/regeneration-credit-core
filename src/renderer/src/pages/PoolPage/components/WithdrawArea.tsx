/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { useChainId, useReadContract } from 'wagmi'
import { contractsPool, ContractsPoolName } from '../contractsPoolList'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { formatUnits } from 'viem'
import { useTranslation } from 'react-i18next'

interface Props {
  poolName: ContractsPoolName
}

export function WithdrawArea({ poolName }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address, isConnected, userType, eraPool: eraPoolUser } = useUserContext()
  const contractPool = contractsPool[poolName]
  const [hasAvailableWithdraw, setHasAvailableWithdraw] = useState(false)

  const { data: eraContract } = useReadContract({
    //@ts-ignore
    address: chainId === 250225 ? contractPool?.addressMainnet : contractPool?.addressTestnet,
    abi: chainId === 250225 ? contractPool?.abiMainnet : contractPool?.abiTestnet,
    functionName: 'currentContractEra'
  })
  const eraPool = eraContract ? parseInt(formatUnits(BigInt(eraContract as string), 0)) : 1

  const { data: responseHaveTokensToWithdraw } = useReadContract({
    //@ts-ignore
    address: chainId === 250225 ? contractPool?.addressMainnet : contractPool?.addressTestnet,
    abi: chainId === 250225 ? contractPool?.abiMainnet : contractPool?.abiTestnet,
    functionName: 'haveTokensToWithdraw',
    args: [address, eraPoolUser]
  })
  const haveTokensToWithdraw = responseHaveTokensToWithdraw
    ? responseHaveTokensToWithdraw.toString() === 'true'
      ? true
      : false
    : false

  useEffect(() => {
    checkWithdraw()
  }, [eraPool, eraPoolUser])

  function checkWithdraw(): void {
    if (eraPoolUser < eraPool) {
      setHasAvailableWithdraw(true)
    } else {
      setHasAvailableWithdraw(false)
    }
  }

  const userTypeThisPool = userTypePerPools[poolName]
  if (userTypeThisPool !== userType) return <div />

  if (!isConnected) return <div />

  return <div />

  if (!hasAvailableWithdraw) {
    return (
      <div className="flex flex-col mt-5 p-3 rounded-2xl bg-container-primary w-[350px]">
        <p className="text-white">{t('youDoNotHaveWithdrawAvailableInThisEra')}</p>
      </div>
    )
  }

  return (
    <div className="flex mt-5 p-3 rounded-2xl bg-container-primary w-fit items-center">
      <div className="flex flex-col mr-10">
        <p className="text-gray-300 text-xs mb-1">{t('youHaveWithdrawsAvailable')}:</p>
        <div className="flex gap-2">
          <p className="text-white">{t('eraOfPool')}:</p>
          <p className="text-white font-bold">{eraPool}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-white">{t('yourEraOnPool')}:</p>
          <p className="text-white font-bold">{eraPoolUser}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-white">{t('availablesWithdraws')}:</p>
          <p className="text-white font-bold">{eraPool - eraPoolUser}</p>
        </div>
      </div>

      <button className="font-semibold text-white rounded-2xl bg-blue-primary px-5 h-10 hover:cursor-pointer">
        {userType === 4 ? (
          <>{haveTokensToWithdraw ? t('withdraw') : t('advanceToNextEra')}</>
        ) : (
          t('withdraw')
        )}
      </button>
    </div>
  )
}

const userTypePerPools = {
  regenerator: 1,
  inspector: 2,
  researcher: 3,
  developer: 4,
  contributor: 5,
  activist: 6
}
