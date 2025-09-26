import { User } from '@renderer/components/User/User'
import { ResourceValidationProps } from '@renderer/types/validation'
import { useTranslation } from 'react-i18next'

interface Props {
  validations: ResourceValidationProps[]
}
export function ValidationsTab({ validations }: Props): JSX.Element {
  const { t } = useTranslation()

  if (validations.length === 0) {
    return <p className="my-10 text-white">{t('common.noValidations')}</p>
  }

  return (
    <div className="flex flex-col gap-2 pt-3 pb-16 max-w-[500px]">
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
    <div className="flex flex-col gap-1 bg-container-primary rounded-2xl p-3">
      <User address={validation.validatorAddress} />
      <p className="text-gray-300 text-xs">{t('common.justification')}</p>
      <p className="text-white text-sm">{validation.justification}</p>
    </div>
  )
}
