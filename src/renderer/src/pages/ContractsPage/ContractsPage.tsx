import { ContractItem } from './components/ContractItem'
import { contractsMainnet, contractsSequoia } from '@renderer/services/contracts'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { useMainnet } from '@renderer/hooks/useMainnet'

export function ContractsPage(): JSX.Element {
  const { t } = useTranslation()
  const mainnet = useMainnet()
  const listContracts = mainnet ? contractsMainnet : contractsSequoia

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
