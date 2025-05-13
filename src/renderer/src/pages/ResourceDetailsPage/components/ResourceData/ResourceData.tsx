import { InspectionData } from './InspectionData'
import { ReportData } from './ReportData'
import { ResearcheData } from './ResearcheData'

interface Props {
  resourceType: string
  id: number
  setValidationsCount: (count: number) => void
  setReport: (report: string) => void
}
export function ResourceData({
  resourceType,
  id,
  setReport,
  setValidationsCount
}: Props): JSX.Element {
  const Resource = resourceData[resourceType as Resources]

  return <Resource id={id} setReport={setReport} setValidationsCount={setValidationsCount} />
}

const resourceData = {
  inspection: InspectionData,
  researche: ResearcheData,
  report: ReportData
}
type Resources = keyof typeof resourceData
