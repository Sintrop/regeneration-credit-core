/* eslint-disable react-hooks/exhaustive-deps */
import { contractsMainnet, contractsSequoia } from '@renderer/services/contracts'
import { ContractListProps } from '@renderer/types/contract'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ContractDetails } from './components/ContractDetails/ContractDetails'
import { SelectorTabContract } from './components/ContractTabs/SelectorTabContract/SelectorTabContract'
import { ContentTabs, ContractPageTabs } from './components/ContractTabs/ContentTabs/ContentTabs'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { useMainnet } from '@renderer/hooks/useMainnet'

export function ContractPage(): JSX.Element {
  const { t } = useTranslation()
  const params = useParams()
  const mainnet = useMainnet()
  const [contractData, setContractData] = useState<ContractListProps>({} as ContractListProps)
  const [selectedTab, setSelectedTab] = useState<ContractPageTabs>('methods')

  useEffect(() => {
    handleGetContractData()
  }, [params])

  function handleGetContractData(): void {
    if (mainnet) {
      const contract = contractsMainnet.find((contract) => contract.address === params.address)
      if (contract) {
        setContractData(contract)
      }
    } else {
      const contract = contractsSequoia.find((contract) => contract.address === params.address)
      if (contract) {
        setContractData(contract)
      }
    }
  }

  return (
    <ScreenPage pageTitle={contractData.label ? t(contractData.label) : contractData.name}>
      <div className="flex flex-col w-full">
        <ContractDetails contract={contractData} />

        <SelectorTabContract selectedTab={selectedTab} onChange={setSelectedTab} />

        <ContentTabs selectedTab={selectedTab} contract={contractData} />
      </div>
    </ScreenPage>
  )
}
