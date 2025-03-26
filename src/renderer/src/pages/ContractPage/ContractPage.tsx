/* eslint-disable react-hooks/exhaustive-deps */
import { Header } from '@renderer/components/Header/Header'
import { contractsSequoia } from '@renderer/services/contracts'
import { ContractListProps } from '@renderer/types/contract'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useChainId } from 'wagmi'
import { SideMenu } from '@renderer/components/SideMenu/SideMenu'
import { PageTitle } from '@renderer/components/PageTitle/PageTitle'
import { ContractDetails } from './components/ContractDetails/ContractDetails'
import { SelectorTabContract } from './components/ContractTabs/SelectorTabContract/SelectorTabContract'
import { ContentTabs, ContractPageTabs } from './components/ContractTabs/ContentTabs/ContentTabs'

export function ContractPage(): JSX.Element {
  const params = useParams()
  const chainId = useChainId()
  const [contractData, setContractData] = useState<ContractListProps>({} as ContractListProps)
  const [selectedTab, setSelectedTab] = useState<ContractPageTabs>('methods')

  useEffect(() => {
    handleGetContractData()
  }, [params])

  function handleGetContractData(): void {
    if (chainId === 1600) {
      const contract = contractsSequoia.find((contract) => contract.address === params.address)
      if (contract) {
        setContractData(contract)
      }
    }
  }

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex w-screen h-screen overflow-y-auto">
        <SideMenu />

        <div className="flex flex-col pl-[330px] py-30 gap-10 w-full px-5">
          <PageTitle title={contractData?.name as string} />
          <div className="flex flex-col w-full">
            <ContractDetails contract={contractData} />

            <SelectorTabContract selectedTab={selectedTab} onChange={setSelectedTab} />

            <ContentTabs selectedTab={selectedTab} contract={contractData} />
          </div>
        </div>
      </main>
    </>
  )
}
