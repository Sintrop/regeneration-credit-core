import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DevelopmentTabs, TabContent } from './components/TabContent'

export function DevelopmentPage(): JSX.Element {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState('reports')

  return (
    <ScreenPage pageTitle={t('development')}>
      <div className="flex items-center gap-5">
        <TabItem
          label={t('reports')}
          value="reports"
          onChange={setSelectedTab}
          isSelected={selectedTab === 'reports'}
        />

        <TabItem
          label={t('developers')}
          value="developers"
          onChange={setSelectedTab}
          isSelected={selectedTab === 'developers'}
        />
      </div>

      <div className="flex flex-col">
        <TabContent selectedTab={selectedTab as DevelopmentTabs} />
      </div>
    </ScreenPage>
  )
}
