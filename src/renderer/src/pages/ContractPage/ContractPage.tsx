/* eslint-disable react-hooks/exhaustive-deps */
import { contractsSequoia } from '@renderer/services/contracts'
import { ContractListProps } from '@renderer/types/contract'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useChainId } from 'wagmi'
import { ContractDetails } from './components/ContractDetails/ContractDetails'
import { SelectorTabContract } from './components/ContractTabs/SelectorTabContract/SelectorTabContract'
import { ContentTabs, ContractPageTabs } from './components/ContractTabs/ContentTabs/ContentTabs'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'

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
    <ScreenPage pageTitle={contractData?.name as string}>
      <div className="flex flex-col w-full">
        <ContractDetails contract={contractData} />

        <SelectorTabContract selectedTab={selectedTab} onChange={setSelectedTab} />

        <ContentTabs selectedTab={selectedTab} contract={contractData} />
      </div>
    </ScreenPage>
  )
}
