/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { useChainId, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { contractsPool, ContractsPoolName } from '../contractsPoolList'
import { EraSelector } from '@renderer/components/EraSelector/EraSelector'
import { Loading } from '@renderer/components/Loading/Loading'
import { useTranslation } from 'react-i18next'
import { EraProps } from '@renderer/types/era'

interface Props {
  poolName: ContractsPoolName
}
export function EraData({ poolName }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const contractPool = contractsPool[poolName]

  const { data } = useReadContract({
    //@ts-ignore
    address: chainId === 250225 ? contractPool?.addressMainnet : contractPool?.addressTestnet,
    abi: chainId === 250225 ? contractPool?.abiMainnet : contractPool?.abiTestnet,
    functionName: 'currentContractEra',
    args: []
  })
  const currentEra = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 1

  const { data: epochContract } = useReadContract({
    //@ts-ignore
    address: chainId === 1600 ? contractPool?.addressTestnet : contractPool?.addressMainnet,
    abi: chainId === 1600 ? contractPool?.abiTestnet : contractPool?.abiMainnet,
    functionName: 'currentEpoch',
    args: []
  })
  const epoch = epochContract ? parseInt(formatUnits(BigInt(epochContract as string), 0)) : 1

  const [era, setEra] = useState(1)

  useEffect(() => {
    setEra(currentEra)
  }, [currentEra])

  const { data: responseEra, isLoading: loadingEra } = useReadContract({
    //@ts-ignore
    address: chainId === 250225 ? contractPool?.addressMainnet : contractPool?.addressTestnet,
    abi: chainId === 250225 ? contractPool?.abiMainnet : contractPool?.abiTestnet,
    functionName: 'getEra',
    args: [era]
  })

  const eraData = responseEra as EraProps

  const { data: responseTokensThisEra } = useReadContract({
    //@ts-ignore
    address: chainId === 250225 ? contractPool?.addressMainnet : contractPool?.addressTestnet,
    abi: chainId === 250225 ? contractPool?.abiMainnet : contractPool?.abiTestnet,
    functionName: 'tokensPerEra',
    args: [epoch, 12]
  })

  const tokensThisEra = responseTokensThisEra
    ? parseInt(formatUnits(BigInt(responseTokensThisEra as string), 18))
    : 0

  return (
    <div className="flex flex-col mt-5">
      <EraSelector currentEra={currentEra} onChange={setEra} selectedEra={era} />

      {loadingEra ? (
        <div className="mx-auto overflow-hidden mt-5">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col">
          {eraData && (
            <div className="flex gap-5">
              <DataItem
                label={t('usersWhoCashedOut')}
                value={formatUnits(BigInt(eraData.users), 0)}
              />
              <DataItem
                label={t('withdrawnTokens')}
                value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(
                  parseFloat(formatUnits(BigInt(eraData.tokens), 18))
                )}
              />
              <DataItem label={t('difficulty')} value={formatUnits(BigInt(eraData.levels), 0)} />
              <DataItem
                label={t('tokensThisEra')}
                value={Intl.NumberFormat('pt-BR').format(tokensThisEra)}
                suffix="RC"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface DataItemProps {
  label: string
  value: string
  suffix?: string
}
function DataItem({ label, value, suffix }: DataItemProps): JSX.Element {
  return (
    <div
      className={`flex flex-col justify-center p-3 rounded-md gap-1 w-[200px] h-[110px] bg-container-primary`}
    >
      <p className="font-bold text-white text-center text-xl">
        {value} {suffix && suffix}
      </p>
      <p className="text-gray-300 text-center">{label}</p>
    </div>
  )
}
