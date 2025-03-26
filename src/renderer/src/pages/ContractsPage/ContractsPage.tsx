import { ContractItem } from './components/ContractItem'
import { useChainId } from 'wagmi'
import { contractsSequoia } from '@renderer/services/contracts'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'

export function ContractsPage(): JSX.Element {
  const chainId = useChainId()
  const listContracts = chainId === 1600 ? contractsSequoia : []

  return (
    <ScreenPage pageTitle="contracts">
      <div className="flex flex-wrap gap-10">
        {listContracts.map((contract, index) => (
          <ContractItem key={index} contract={contract} />
        ))}
      </div>
    </ScreenPage>
  )
}
