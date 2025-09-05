import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
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
  const [selectedTab, setSelectedTab] = useState('offsets')

  return (
    <ScreenPage pageTitle={t('feed.title')}>
      <div className="w-full flex gap-10 overflow-x-scroll">
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 h-10">
            <TabItem
              label={t('feed.offsets')}
              onChange={setSelectedTab}
              value="offsets"
              isSelected={selectedTab === 'offsets'}
            />

            <TabItem
              label={t('feed.inspections')}
              onChange={setSelectedTab}
              value="inspections"
              isSelected={selectedTab === 'inspections'}
            />
          </div>

          <div className="flex flex-col w-[500px]">
            {selectedTab === 'inspections' && <InspectionsFeedTab />}
            {selectedTab === 'offsets' && <LatestOffsets />}
          </div>
        </div>

        <div className="flex flex-col w-[350px] gap-10">
          <ResearchesFeedTab />
          <ReportsFeed />
          <ContributionsFeedTab />
        </div>
      </div>
    </ScreenPage>
  )
}
