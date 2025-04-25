import { useTranslation } from 'react-i18next'
import { GeneralActions } from './components/GeneralActions/GeneralActions'
import { UserTypeActions } from './components/UserTypeActions/UserTypeActions'

interface Props {
  userType: number
}
export function Actions({ userType }: Props): JSX.Element {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1 w-[400px] pt-3">
      <p className="text-gray-300 text-sm">{t('actions')}</p>
      <div className="flex flex-col max-h-28 overflow-y-auto overflow-x-hidden gap-5">
        <GeneralActions />
        <UserTypeActions userType={userType} />
        <div className="mb-10" />
      </div>
    </div>
  )
}
