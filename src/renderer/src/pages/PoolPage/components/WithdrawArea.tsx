import { useAccount } from 'wagmi'
import { ContractsPoolName } from '../contractsPoolList'

interface Props {
  poolName: ContractsPoolName
}

export function WithdrawArea({ poolName }: Props): JSX.Element {
  const { isDisconnected, address } = useAccount()
  if (isDisconnected) return <div />
  
  return (
    <div className="flex flex- mt-5">
      withdraw area
    </div>
  )
}
