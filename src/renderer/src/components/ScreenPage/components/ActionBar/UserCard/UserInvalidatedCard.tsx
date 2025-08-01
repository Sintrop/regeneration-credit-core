import { useAccount } from 'wagmi'
import { BasicData } from './BasicData'
import { useTranslation } from 'react-i18next'

export function UserInvalidatedCard(): JSX.Element {
  const { t } = useTranslation()
  const { address } = useAccount()

  return (
    <BasicData
      address={address ? address : ''}
      name={t('actionBar.invalidatedUser')}
      photoHash=""
      userTypeName=""
      indicator={0}
    />
  )
}
