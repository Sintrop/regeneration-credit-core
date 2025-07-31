import { ContractItem } from './components/ContractItem'
import { useChainId } from 'wagmi'
import { contractsSequoia } from '@renderer/services/contracts'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'

export function ContractsPage(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const listContracts = chainId === 1600 ? contractsSequoia : []

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
