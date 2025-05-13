import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ResourceData } from './components/ResourceData/ResourceData'
import { useState } from 'react'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { PdfTab } from './components/PdfTab/PdfTab'
import { ValidationsTab } from './components/ValidationsTab/ValidationsTab'

export function ResourceDetailsPage(): JSX.Element {
  const { t } = useTranslation()
  const { resourceType, id } = useParams()
  const [report, setReport] = useState<string>('')
  const [validationsCount, setValidationsCount] = useState<number>(0)
  const [selectedTab, setSelectedTab] = useState('pdf')

  return (
    <ScreenPage pageTitle={`${t(resourceType as string)} #${id}`}>
      <ResourceData
        resourceType={resourceType as string}
        id={parseInt(id as string)}
        setReport={setReport}
        setValidationsCount={setValidationsCount}
      />

      <div className="mt-5 flex items-center gap-3">
        <TabItem
          value="pdf"
          label={t('report')}
          onChange={setSelectedTab}
          isSelected={selectedTab === 'pdf'}
        />

        <TabItem
          value="validations"
          label={t('validations')}
          onChange={setSelectedTab}
          isSelected={selectedTab === 'validations'}
        />
      </div>

      {selectedTab === 'pdf' && <PdfTab report={report} />}
      {selectedTab === 'validations' && (
        <ValidationsTab
          validationsCount={validationsCount}
          resourceId={parseInt(id as string)}
          resourceType={resourceType as string}
        />
      )}
    </ScreenPage>
  )
}
