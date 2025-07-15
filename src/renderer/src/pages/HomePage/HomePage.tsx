import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { LatestPublications } from './components/FeedTabs/LatestPublications/LatestPublications'
import { LatestOffsets } from './components/FeedTabs/LatestOffsets/LatestOffsets'
import { ContributionsFeedTab } from './components/FeedTabs/ContributionsFeedTab/ContributionsFeedTab'
import { ResearchesFeedTab } from './components/FeedTabs/ResearchesFeedTab/ResearchesFeedTab'
import { ReportsFeed } from './components/FeedTabs/ReportsFeed/ReportsFeed'
import { InspectionsFeedTab } from './components/FeedTabs/InspectionsFeedTab/InspectionsFeedTab'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export function HomePage(): JSX.Element {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState('publications')

  return (
    <ScreenPage pageTitle="feed">
      <div className="w-full flex gap-10 overflow-x-scroll">
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 h-10">
            <TabItem
              label={t('publications')}
              onChange={setSelectedTab}
              value="publications"
              isSelected={selectedTab === 'publications'}
            />

            <TabItem
              label={t('inspections')}
              onChange={setSelectedTab}
              value="inspections"
              isSelected={selectedTab === 'inspections'}
            />
          </div>

          <div className="flex flex-col w-[500px]">
            {selectedTab === 'inspections' && <InspectionsFeedTab />}
            {selectedTab === 'publications' && <LatestPublications />}
          </div>
        </div>

        <div className="flex flex-col w-[350px] gap-10">
          <LatestOffsets />
          <ReportsFeed />
          <ContributionsFeedTab />
          <ResearchesFeedTab />
        </div>
      </div>
    </ScreenPage>
  )
}
