import { ContractListProps } from '@renderer/types/contract'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface Props {
  contract: ContractListProps
}

export function ContractItem({ contract }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleNavigateToContract(): void {
    navigate(`/contracts/${contract.address}`)
  }

  return (
    <div className="w-64 rounded-2xl bg-container-primary p-5 gap-1 flex flex-col justify-between">
      <h3 className="font-semibold text-white text-start">{contract.name}</h3>
      <p className="text-gray-300 text-sm text-start">{contract.description}</p>
      <button
        className="mt-5 text-green-600 underline hover:cursor-pointer w-fit"
        onClick={handleNavigateToContract}
      >
        {t('contracts.see')}
      </button>
    </div>
  )
}
