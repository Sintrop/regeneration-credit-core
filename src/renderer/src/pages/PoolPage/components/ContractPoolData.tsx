/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useChainId, useReadContract } from 'wagmi'
import { contractsPool, ContractsPoolName } from '../contractsPoolList'
import { formatUnits } from 'viem'
import { sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'
import { Loading } from '@renderer/components/Loading/Loading'

interface Props {
  poolName: ContractsPoolName
}
export function ContractPoolData({ poolName }: Props): JSX.Element {
  const chainId = useChainId()

  const contractPool = contractsPool[poolName]

  const { data: eraContract, isLoading: loading1 } = useReadContract({
    //@ts-ignore
    address: chainId === 1600 ? contractPool?.addressTestnet : contractPool?.addressMainnet,
    abi: chainId === 1600 ? contractPool?.abiTestnet : contractPool?.abiMainnet,
    functionName: 'currentContractEra',
    args: []
  })

  const { data: epochContract, isLoading: loading2 } = useReadContract({
    //@ts-ignore
    address: chainId === 1600 ? contractPool?.addressTestnet : contractPool?.addressMainnet,
    abi: chainId === 1600 ? contractPool?.abiTestnet : contractPool?.abiMainnet,
    functionName: 'currentEpoch',
    args: []
  })

  const { data: balanceContract, isLoading: loading3 } = useReadContract({
    //@ts-ignore
    address: chainId === 1600 ? sequoiaRcAddress : sequoiaRcAddress,
    abi: chainId === 1600 ? sequoiaRcAbi : sequoiaRcAbi,
    functionName: 'balanceOf',
    args: [`${chainId === 1600 ? contractPool?.addressTestnet : contractPool?.addressMainnet}`]
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
    <div className="flex flex-wrap gap-5">
      <DataItem
        label="totalFunds"
        value={Intl.NumberFormat('pt-BR').format(
          parseFloat(formatUnits(contractPool.poolFunds, 18))
        )}
        suffix="RC"
      />
      {era && <DataItem label="currentEra" value={formatUnits(BigInt(era), 0)} bgGreen />}
      {epoch && <DataItem label="atualEpoch" value={formatUnits(BigInt(epoch), 0)} bgGreen />}
      {balance && (
        <DataItem
          label="balanceContract"
          value={Intl.NumberFormat('pt-BR').format(Number(formatUnits(BigInt(balance), 18)))}
          suffix="RC"
        />
      )}
    </div>
  )
}

interface DataItemProps {
  label: string
  value: string
  bgGreen?: boolean
  suffix?: string
}
function DataItem({ label, value, bgGreen, suffix }: DataItemProps): JSX.Element {
  return (
    <div
      className={`flex flex-col justify-center p-3 rounded-2xl gap-1 w-[170px] h-[100px] ${bgGreen ? 'bg-green-card' : 'bg-container-primary'}`}
    >
      <p className="text-white">{label}:</p>
      <p className="font-bold text-white text-xl">
        {value} {suffix && suffix}
      </p>
    </div>
  )
}
