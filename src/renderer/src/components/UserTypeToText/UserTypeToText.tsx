import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
  userType: number
}

export function UserTypeToText({ userType, ...restProps }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <p {...restProps}>
      {userType === 1 && t('regenerator')}
      {userType === 2 && t('inspector')}
      {userType === 3 && t('researcher')}
      {userType === 4 && t('developer')}
      {userType === 5 && t('contributor')}
      {userType === 6 && t('activist')}
      {userType === 7 && t('supporter')}
    </p>
  )
}
