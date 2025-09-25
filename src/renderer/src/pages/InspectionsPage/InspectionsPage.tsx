import { useState } from 'react'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { InspectionsTabs, TabContent } from './components/TabContent'
import { Subtitles } from '@renderer/components/Subtitles/Subtitles'

export function InspectionsPage(): JSX.Element {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState('inspections')

  return (
    <ScreenPage pageTitle={t('resources.inspections')}>
      <div className="flex items-end w-full justify-between gap-5 relative">
        <TabItem
          label={t('resources.inspections')}
          value="inspections"
          onChange={setSelectedTab}
          isSelected={selectedTab === 'inspections'}
        />

        <div className="absolute top-[-50] right-0">
          <Subtitles subtitles={['acceptInspection', 'seeContent', 'vote']} />
        </div>
      </div>

      <div className="flex flex-col mt-3 mb-16">
        <TabContent selectedTab={selectedTab as InspectionsTabs} />
      </div>
    </ScreenPage>
  )
}
