import { ContractListProps } from '@renderer/types/contract'
import { useTranslation } from 'react-i18next'

interface Props {
  contract: ContractListProps
}

export function ContractDetails({ contract }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-green-card">
        <div className="flex items-center gap-2">
          <p className="font-bold text-white">{t('contracts.name')}:</p>
          <p className="text-white">{contract?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-bold text-white">{t('contracts.address')}:</p>
          <p className="text-white">{contract?.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-bold text-white">{t('contracts.description')}:</p>
          <p className="text-white">{t(contract?.description ? contract.description : '')}</p>
        </div>
      </div>
    </section>
  )
}
