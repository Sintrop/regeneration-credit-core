import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ResearchesTabs, TabContent } from './components/TabContent'

export function ResearchesPage(): JSX.Element {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState('researches')

  return (
    <ScreenPage pageTitle={t('resources.researches')}>
      <div className="flex items-center gap-5">
        <TabItem
          label={t('resources.researches')}
          value="researches"
          onChange={setSelectedTab}
          isSelected={selectedTab === 'researches'}
        />

        <TabItem
          label={t('resources.researchers')}
          value="researchers"
          onChange={setSelectedTab}
          isSelected={selectedTab === 'researchers'}
        />

        <TabItem
          label={t('resources.calculatorItems')}
          value="calculatorItems"
          onChange={setSelectedTab}
          isSelected={selectedTab === 'calculatorItems'}
        />

        <TabItem
          label={t('resources.evaluationMethods')}
          value="evaluationMethods"
          onChange={setSelectedTab}
          isSelected={selectedTab === 'evaluationMethods'}
        />
      </div>

      <div className="flex flex-col mt-3">
        <TabContent selectedTab={selectedTab as ResearchesTabs} />
      </div>
    </ScreenPage>
  )
}
