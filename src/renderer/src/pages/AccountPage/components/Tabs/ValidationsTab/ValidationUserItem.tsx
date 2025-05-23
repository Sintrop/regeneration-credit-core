import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { ValidationProps } from '@renderer/types/validation'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'

interface Props {
  validation: ValidationProps
}

export function ValidationUserItem({ validation }: Props): JSX.Element {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col p-3 rounded-2xl bg-green-card">
      <div className="flex items-center gap-2">
        <p className="text-white">{t('validator')}:</p>
        <UserAddressLink address={validation.validator}/>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-white">{t('justification')}:</p>
        <p className="text-white">{validation.justification}</p>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-white">{t('createdAt')}:</p>
        <p className="text-white">{formatUnits(BigInt(validation.createdAtBlockNumber), 0)}</p>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-white">{t('votesToInvalidate')}:</p>
        <p className="text-white">{formatUnits(BigInt(validation.votesToInvalidate), 0)}</p>
      </div>
    </div>
  )
}
