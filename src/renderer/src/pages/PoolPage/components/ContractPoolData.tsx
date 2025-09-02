/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useReadContract } from 'wagmi'
import { contractsPool, ContractsPoolName } from '../contractsPoolList'
import { formatUnits } from 'viem'
import { sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'
import { Loading } from '@renderer/components/Loading/Loading'
import { useTranslation } from 'react-i18next'
import { useMainnet } from '@renderer/hooks/useMainnet'

interface Props {
  poolName: ContractsPoolName
}
export function ContractPoolData({ poolName }: Props): JSX.Element {
  const { t } = useTranslation()
  const mainnet = useMainnet()

  const contractPool = contractsPool[poolName]

  const { data: eraContract, isLoading: loading1 } = useReadContract({
    //@ts-ignore
    address: mainnet ? contractPool?.addressMainnet : contractPool?.addressTestnet,
    abi: mainnet ? contractPool?.abiMainnet : contractPool?.abiTestnet,
    functionName: 'currentContractEra',
    args: []
  })

  const { data: epochContract, isLoading: loading2 } = useReadContract({
    //@ts-ignore
    address: mainnet ? contractPool?.addressMainnet : contractPool?.addressTestnet,
    abi: mainnet ? contractPool?.abiMainnet : contractPool?.abiTestnet,
    functionName: 'currentEpoch',
    args: []
  })

  const { data: balanceContract, isLoading: loading3 } = useReadContract({
    //@ts-ignore
    address: mainnet ? sequoiaRcAddress : sequoiaRcAddress,
    abi: mainnet ? sequoiaRcAbi : sequoiaRcAbi,
    functionName: 'balanceOf',
    args: [`${mainnet ? contractPool?.addressMainnet : contractPool?.addressTestnet}`]
  })

  const epoch = epochContract as string
  const era = eraContract as string
  const balance = balanceContract as string

  if (loading1 || loading2 || loading3) {
    return (
      <div className="mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-5 p-3 rounded-xl bg-green-card w-fit">
      <div className="flex flex-col gap-5">
        <DataItem
          label={t('pools.totalFunds')}
          value={Intl.NumberFormat('pt-BR').format(
            parseFloat(formatUnits(contractPool.poolFunds, 18))
          )}
          suffix="RC"
        />
        {era && (
          <DataItem label={t('pools.currentEra')} value={formatUnits(BigInt(era), 0)} bgGreen />
        )}
      </div>

      <div className="flex flex-col gap-5">
        {balance && (
          <DataItem
            label={t('pools.contractBalance')}
            value={Intl.NumberFormat('pt-BR').format(Number(formatUnits(BigInt(balance), 18)))}
            suffix="RC"
          />
        )}
        {epoch && (
          <DataItem label={t('pools.currentEpoch')} value={formatUnits(BigInt(epoch), 0)} bgGreen />
        )}
      </div>
    </div>
  )
}

interface DataItemProps {
  label: string
  value: string
  bgGreen?: boolean
  suffix?: string
}
function DataItem({ label, value, suffix }: DataItemProps): JSX.Element {
  return (
    <div
      className={`flex flex-col justify-center p-3 rounded-md gap-1 w-[200px] h-[110px] bg-container-primary`}
    >
      <p className="text-white">{label}:</p>
      <p className="font-bold text-white text-xl">
        {value} {suffix && suffix}
      </p>
    </div>
  )
}
