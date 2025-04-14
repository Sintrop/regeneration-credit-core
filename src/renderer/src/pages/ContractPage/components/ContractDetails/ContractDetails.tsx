import { ContractListProps } from '@renderer/types/contract'
import { useTranslation } from 'react-i18next'

interface Props {
  contract: ContractListProps
}

export function ContractDetails({ contract }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-3 h-10 rounded-2xl bg-green-card">
        <p className="font-bold text-white">{t('address')}:</p>
        <p className="text-white">{contract?.address}</p>
      </div>
    </section>
  )
}
