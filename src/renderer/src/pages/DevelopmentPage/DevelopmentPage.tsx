import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DevelopmentTabs, TabContent } from './components/TabContent'
import { Subtitles } from '@renderer/components/Subtitles/Subtitles'

export function DevelopmentPage(): JSX.Element {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState('reports')

  return (
    <ScreenPage pageTitle={t('resources.development')}>
      <div className="flex items-end w-full justify-between gap-5 relative">
        <div className="flex items-center gap-5">
          <TabItem
            label={t('resources.reports')}
            value="reports"
            onChange={setSelectedTab}
            isSelected={selectedTab === 'reports'}
          />

          <TabItem
            label={t('resources.developers')}
            value="developers"
            onChange={setSelectedTab}
            isSelected={selectedTab === 'developers'}
          />
        </div>

        <div className="absolute top-[-30] right-0">
          <Subtitles subtitles={['seeContent', 'vote']} />
        </div>
      </div>

      <div className="flex flex-col mt-3">
        <TabContent selectedTab={selectedTab as DevelopmentTabs} />
      </div>
    </ScreenPage>
  )
}
