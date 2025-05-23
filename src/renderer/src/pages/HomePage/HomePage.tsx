import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { LatestPublications } from './components/FeedTabs/LatestPublications/LatestPublications'
import { LatestOffsets } from './components/FeedTabs/LatestOffsets/LatestOffsets'
import { ContributionsFeedTab } from './components/FeedTabs/ContributionsFeedTab/ContributionsFeedTab'
import { ResearchesFeedTab } from './components/FeedTabs/ResearchesFeedTab/ResearchesFeedTab'
import { ReportsFeed } from './components/FeedTabs/ReportsFeed/ReportsFeed'
import { InspectionsFeedTab } from './components/FeedTabs/InspectionsFeedTab/InspectionsFeedTab'

export function HomePage(): JSX.Element {
  return (
    <ScreenPage pageTitle="feed">
      <div className="w-full flex gap-10 overflow-x-scroll">
        <InspectionsFeedTab />
        <LatestPublications />
        <LatestOffsets />
        <ReportsFeed />
        <ContributionsFeedTab />
        <ResearchesFeedTab />
      </div>
    </ScreenPage>
  )
}
