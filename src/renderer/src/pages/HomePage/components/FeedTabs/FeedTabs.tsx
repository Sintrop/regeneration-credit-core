import { useState } from 'react'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { useTranslation } from 'react-i18next'
import { LatestOffsets } from './LatestOffsets/LatestOffsets'
import { ContributionsFeedTab } from './ContributionsFeedTab/ContributionsFeedTab'
import { ResearchesFeedTab } from './ResearchesFeedTab/ResearchesFeedTab'

export function FeedTabs(): JSX.Element {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState<FeedTabs>('offsets')

  const Tab = tabs[selectedTab]

  return (
    <div className="flex flex-col">
      <div className="flex gap-5 mb-3">
        <TabItem
          value="offsets"
          label={t('offsets')}
          isSelected={selectedTab === 'offsets'}
          onChange={(value) => setSelectedTab(value as FeedTabs)}
        />

        <TabItem
          value="contributions"
          label={t('contributions')}
          isSelected={selectedTab === 'contributions'}
          onChange={(value) => setSelectedTab(value as FeedTabs)}
        />

        <TabItem
          value="researches"
          label={t('researches')}
          isSelected={selectedTab === 'researches'}
          onChange={(value) => setSelectedTab(value as FeedTabs)}
        />
      </div>

      <Tab />
    </div>
  )
}

const tabs = {
  offsets: LatestOffsets,
  contributions: ContributionsFeedTab,
  researches: ResearchesFeedTab
}

type FeedTabs = keyof typeof tabs
