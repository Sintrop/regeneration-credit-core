/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useChainId, useReadContract } from 'wagmi'
import { contractsPool, ContractsPoolName } from '../contractsPoolList'
import { formatUnits } from 'viem'
import { sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'

interface Props {
  poolName: ContractsPoolName
}
export function ContractPoolData({ poolName }: Props): JSX.Element {
  const chainId = useChainId()

  const contractPool = contractsPool[poolName]

  const { data: eraContract } = useReadContract({
    //@ts-ignore
    address: chainId === 1600 ? contractPool?.addressTestnet : contractPool?.addressMainnet,
    abi: chainId === 1600 ? contractPool?.abiTestnet : contractPool?.abiMainnet,
    functionName: 'currentContractEra',
    args: []
  })

  const { data: epochContract } = useReadContract({
    //@ts-ignore
    address: chainId === 1600 ? contractPool?.addressTestnet : contractPool?.addressMainnet,
    abi: chainId === 1600 ? contractPool?.abiTestnet : contractPool?.abiMainnet,
    functionName: 'currentEpoch',
    args: []
  })

  const { data: balanceContract } = useReadContract({
    //@ts-ignore
    address: chainId === 1600 ? sequoiaRcAddress : sequoiaRcAddress,
    abi: chainId === 1600 ? sequoiaRcAbi : sequoiaRcAbi,
    functionName: 'balanceOf',
    args: [`${chainId === 1600 ? contractPool?.addressTestnet : contractPool?.addressMainnet}`]
  })

  const epoch = epochContract as string
  const era = eraContract as string
  const balance = balanceContract as string

  return (
    <div className="flex flex-col gap-5">
      <DataItem
        label="totalFunds"
        value={Intl.NumberFormat('pt-BR').format(
          parseFloat(formatUnits(contractPool.poolFunds, 18))
        )}
      />
      {era && <DataItem label="atualEra" value={formatUnits(BigInt(era), 0)} />}
      {epoch && <DataItem label="atualEpoch" value={formatUnits(BigInt(epoch), 0)} />}
      {balance && (
        <DataItem
          label="balanceContract"
          value={Intl.NumberFormat('pt-BR').format(Number(formatUnits(BigInt(balance), 18)))}
        />
      )}
    </div>
  )
}

interface DataItemProps {
  label: string
  value: string
}
function DataItem({ label, value }: DataItemProps): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <p className="font-bold text-white">{label}:</p>
      <p className="text-white">{value}</p>
    </div>
  )
}
