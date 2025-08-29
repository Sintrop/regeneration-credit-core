import { useState } from 'react'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { useTranslation } from 'react-i18next'
import { ContributionsTab, TabContent } from './components/TabContent'
import { Subtitles } from '@renderer/components/Subtitles/Subtitles'

export function ContributionsPage(): JSX.Element {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState('contributions')

  return (
    <ScreenPage pageTitle={t('resources.contributions')}>
      <div className="flex items-end w-full justify-between gap-5 relative">
        <div className="flex items-center gap-5">
          <TabItem
            label={t('resources.contributions')}
            value="contributions"
            onChange={setSelectedTab}
            isSelected={selectedTab === 'contributions'}
          />

          <TabItem
            label={t('resources.contributors')}
            value="contributors"
            onChange={setSelectedTab}
            isSelected={selectedTab === 'contributors'}
          />
        </div>

        <div className="absolute top-[-30] right-0">
          <Subtitles subtitles={['seeContent', 'vote']} />
        </div>
      </div>

      <div className="flex flex-col mt-3">
        <TabContent selectedTab={selectedTab as ContributionsTab} />
      </div>
    </ScreenPage>
  )
}
