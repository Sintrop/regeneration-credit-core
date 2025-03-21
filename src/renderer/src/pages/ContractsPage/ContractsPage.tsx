import { Header } from '@renderer/components/Header/Header'
import { ContractItem } from './components/ContractItem'
import { useChainId } from 'wagmi'
import { contractsSequoia } from '@renderer/services/contracts'

export function ContractsPage(): JSX.Element {
  const chainId = useChainId()
  const listContracts = chainId === 1600 ? contractsSequoia : []

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col w-screen h-screen py-24 overflow-y-auto">
        <div className="container mx-auto flex">
          <div className="flex flex-wrap gap-10">
            {listContracts.map((contract, index) => (
              <ContractItem key={index} contract={contract} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
