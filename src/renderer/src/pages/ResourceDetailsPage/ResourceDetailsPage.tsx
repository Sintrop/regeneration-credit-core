import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ResourceData } from './components/ResourceData/ResourceData'
import { useState } from 'react'
import { TabItem } from '@renderer/components/TabItem/TabItem'
import { PdfTab } from './components/PdfTab/PdfTab'

export function ResourceDetailsPage(): JSX.Element {
  const { t } = useTranslation()
  const { resourceType, id } = useParams()
  const [report, setReport] = useState<string>('')
  const [reportPhotos, setReportPhotos] = useState<string>('')
  const [selectedTab, setSelectedTab] = useState('pdf')

  return (
    <ScreenPage pageTitle={`${t(`common.${resourceType as string}`)} #${id}`}>
      <ResourceData
        resourceType={resourceType as string}
        id={parseInt(id as string)}
        setReport={setReport}
        setProofPhotos={setReportPhotos}
      />

      <div className="mt-5 flex items-center gap-3">
        <TabItem
          value="pdf"
          label={t('report')}
          onChange={setSelectedTab}
          isSelected={selectedTab === 'pdf'}
        />

        {resourceType === 'inspection' && (
          <TabItem
            value="proofPhotos"
            label={t('proofPhotos')}
            onChange={setSelectedTab}
            isSelected={selectedTab === 'proofPhotos'}
          />
        )}
      </div>

      {selectedTab === 'pdf' && <PdfTab report={report} />}
      {selectedTab === 'proofPhotos' && <PdfTab report={reportPhotos} />}
    </ScreenPage>
  )
}
