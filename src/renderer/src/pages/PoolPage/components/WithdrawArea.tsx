/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { contractsPool, ContractsPoolName } from '../contractsPoolList'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { formatUnits } from 'viem'
import { useTranslation } from 'react-i18next'
import { ActionComponent } from '@renderer/components/ScreenPage/components/ActionBar/Actions/components/ActionComponent/ActionComponent'

interface Props {
  poolName: ContractsPoolName
}

export function WithdrawArea({ poolName }: Props): JSX.Element {
  const { t } = useTranslation()
  const { address, isConnected, userType, eraPool: eraPoolUser } = useUserContext()
  const contractPool = contractsPool[poolName]
  const [hasAvailableWithdraw, setHasAvailableWithdraw] = useState(false)

  const { data: eraContract } = useReadContract({
    //@ts-ignore
    address: contractPool?.addressMainnet,
    abi: contractPool?.abiMainnet,
    functionName: 'currentContractEra'
  })
  const eraPool = eraContract ? parseInt(formatUnits(BigInt(eraContract as string), 0)) : 1

  const { data: responseHaveTokensToWithdraw } = useReadContract({
    //@ts-ignore
    address: contractPool?.addressMainnet,
    abi: contractPool?.abiMainnet,
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

  // const userTypeThisPool = userTypePerPools[poolName]
  // if (userTypeThisPool !== userType) return <div />
  const thisUserBelongsToThisPool = userTypePerPools[poolName].find((item) => item === userType)
  if (!thisUserBelongsToThisPool) return <div />

  if (!isConnected) return <div />

  if (!hasAvailableWithdraw) {
    return (
      <div className="flex flex-col mt-5 p-3 rounded-2xl bg-container-primary w-[450px]">
        <p className="text-white">{t('pools.youDoNotHaveWithdrawAvailableInThisEra')}</p>
      </div>
    )
  }

  return (
    <div className="flex w-[450px] justify-between mt-5 p-3 rounded-2xl bg-container-primary items-center">
      <div className="flex flex-col">
        <p className="text-gray-300 text-xs mb-1">{t('pools.youHaveWithdrawsAvailable')}:</p>
        <div className="flex gap-2">
          <p className="text-white">{t('pools.poolEra')}:</p>
          <p className="text-white font-bold">{eraPool}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-white">{t('pools.yourEraOnPool')}:</p>
          <p className="text-white font-bold">{eraPoolUser}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-white">{t('pools.availablesWithdraws')}:</p>
          <p className="text-white font-bold">{eraPool - eraPoolUser}</p>
        </div>
      </div>

      {eraPoolUser < eraPool && (
        <ActionComponent
          actionName="withdraw"
          addressContract={contractPool.userAddressMainnet}
          //@ts-ignore
          abi={contractPool.userAbiMainnet}
          label={haveTokensToWithdraw ? t('pools.withdraw') : t('pools.advanceToNextEra')}
          withdrawPools
        />
      )}
    </div>
  )
}

const userTypePerPools = {
  regenerator: [1],
  inspector: [2],
  researcher: [3],
  developer: [4],
  contributor: [5],
  activist: [6],
  validation: [3, 4, 5]
}
