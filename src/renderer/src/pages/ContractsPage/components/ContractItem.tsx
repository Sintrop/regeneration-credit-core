import { ContractListProps } from '@renderer/types/contract'

interface Props {
  contract: ContractListProps
}

export function ContractItem({ contract }: Props): JSX.Element {
  return (
    <button className="w-[200px] h-[230px] rounded-2xl bg-container-primary p-5 flex flex-col hover:cursor-pointer">
      <div className="w-10 h-10 bg-red-500" />
      <h3 className="font-semibold text-white mt-5">{contract.name}</h3>
      <p className="text-gray-300 text-sm text-start">{contract.description}</p>
    </button>
  )
}
