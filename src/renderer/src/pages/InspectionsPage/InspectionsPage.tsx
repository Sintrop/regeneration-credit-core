import { useState } from 'react'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { InspectionsTabs, TabContent } from './components/TabContent'

export function InspectionsPage(): JSX.Element {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState('inspections')

  return (
    <ScreenPage pageTitle={t('inspections')}>
      <div className="flex items-center gap-5">
        <TabItem
          label={t('inspections')}
          value="inspections"
          onChange={setSelectedTab}
          isSelected={selectedTab === 'inspections'}
        />
      </div>

      <div className="flex flex-col">
        <TabContent selectedTab={selectedTab as InspectionsTabs} />
      </div>
    </ScreenPage>
  )
}
