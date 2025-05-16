import { useTranslation } from 'react-i18next'
import { GeneralActions } from './components/GeneralActions/GeneralActions'
import { UserTypeActions } from './components/UserTypeActions/UserTypeActions'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useState } from 'react'

interface Props {
  userType: number
  lastPublishedWork: number
}
export function Actions({ userType, lastPublishedWork }: Props): JSX.Element {
  const { t } = useTranslation()
  const [openActions, setOpenActions] = useState(false)

  function toggleShowActions(): void {
    setOpenActions((value) => !value)
  }

  return (
    <div className="flex items-end gap-7 relative">
      <UserTypeActions userType={userType} lastPublishedWork={lastPublishedWork} mainAction />
      <button
        className="px-5 h-10 rounded-2xl bg-blue-primary font-semibold text-white hover:cursor-pointer flex items-center justify-center gap-5"
        onClick={toggleShowActions}
      >
        {t('seeAllActions')}

        {openActions ? <FaChevronDown color="white" /> : <FaChevronUp color="white" />}
      </button>

      <div
        className={`absolute w-[180px] ${openActions ? 'h-auto' : 'h-0'} bg-container-primary rounded-2xl right-0 bottom-14 z-50 overflow-hidden duration-300`}
      >
        <GeneralActions />
        <UserTypeActions userType={userType} lastPublishedWork={lastPublishedWork} />
      </div>
    </div>
  )
}
