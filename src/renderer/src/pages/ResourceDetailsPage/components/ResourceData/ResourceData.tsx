import { ContributionData } from './ContributionData'
import { InspectionData } from './InspectionData'
import { ReportData } from './ReportData'
import { ResearcheData } from './ResearcheData'

interface Props {
  resourceType: string
  id: number
  setReport: (report: string) => void
}
export function ResourceData({ resourceType, id, setReport }: Props): JSX.Element {
  const Resource = resourceData[resourceType as Resources]

  return <Resource id={id} setReport={setReport} />
}

const resourceData = {
  inspection: InspectionData,
  researche: ResearcheData,
  report: ReportData,
  contribution: ContributionData
}
type Resources = keyof typeof resourceData
