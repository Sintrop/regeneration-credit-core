import { ContractItem } from './components/ContractItem'
import { contractsMainnet } from '@renderer/services/contracts'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'

export function ContractsPage(): JSX.Element {
  const { t } = useTranslation()
  const listContracts = contractsMainnet

  return (
    <ScreenPage pageTitle={t('contracts.title')}>
      <div className="flex flex-wrap gap-5 mb-10">
        {listContracts.map((contract, index) => (
          <ContractItem key={index} contract={contract} />
        ))}
      </div>
    </ScreenPage>
  )
}
