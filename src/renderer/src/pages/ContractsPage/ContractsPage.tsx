import { Header } from '@renderer/components/Header/Header'
import { ContractItem } from './components/ContractItem'
import { useChainId } from 'wagmi'
import { contractsSequoia } from '@renderer/services/contracts'
import { SideMenu } from '@renderer/components/SideMenu/SideMenu'
import { PageTitle } from '@renderer/components/PageTitle/PageTitle'

export function ContractsPage(): JSX.Element {
  const chainId = useChainId()
  const listContracts = chainId === 1600 ? contractsSequoia : []

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex w-screen h-screen overflow-y-auto">
        <SideMenu />

        <div className="flex flex-col gap-10 py-30 pl-[340px]">
          <PageTitle title="contracts" />
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
