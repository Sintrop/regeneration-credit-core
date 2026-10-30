import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { ResourceValidationProps } from '@renderer/types/validation'
import { useTranslation } from 'react-i18next'

interface Props {
  validations: ResourceValidationProps[]
}
export function ValidationsTab({ validations }: Props): JSX.Element {
  const { t } = useTranslation()

  if (validations.length === 0) {
    return (
      <p className="p-8 rounded-2xl bg-card-primary text-center text-gray-300">
        {t('common.noValidations')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {validations.map((item, index) => (
        <ValidationItem key={index} validation={item} />
      ))}
    </div>
  )
}

interface ValidationItemProps {
  validation: ResourceValidationProps
}

function ValidationItem({ validation }: ValidationItemProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2 bg-card-primary rounded-2xl p-4">
      <UserBadge address={validation.validatorAddress} />
      <p className="text-gray-300 text-xs">{t('common.justification')}</p>
      <p className="text-white text-sm">{validation.justification}</p>
    </div>
  )
}
