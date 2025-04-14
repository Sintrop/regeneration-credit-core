import { ContractListProps } from '@renderer/types/contract'
import { useNavigate } from 'react-router-dom'

interface Props {
  contract: ContractListProps
}

export function ContractItem({ contract }: Props): JSX.Element {
  const navigate = useNavigate()

  function handleNavigateToContract(): void {
    navigate(`/contracts/${contract.address}`)
  }

  return (
    <button
      className="w-full rounded-2xl bg-container-primary p-5 gap-1 flex flex-col hover:cursor-pointer"
      onClick={handleNavigateToContract}
    >
      <h3 className="font-semibold text-white text-start">{contract.name}</h3>
      <p className="text-gray-300 text-sm text-start">{contract.description}</p>
    </button>
  )
}
