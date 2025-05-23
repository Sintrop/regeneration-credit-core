import { ApprovedInvites } from './ApprovedInvites/ApprovedInvites'
import { CertificatesTab } from './CertificatesTab/CertificatesTab'
import { InspectionsHistoryTab } from './InspectionsHistory/InspectionsHistoryTab'
import { InvitationTab } from './InvitationTab'
import { OffsetsTab } from './OffsetsTab/OffsetsTab'
import { PublicationsTab } from './PublicationsTab/PublicationsTab'
import { PushCoordProps, RegenerationAreaTab } from './RegenerationAreaTab/RegenerationAreaTab'
import { ReportsTab } from './ReportsTab/ReportsTab'
import { ResearchesTab } from './ResearchesTab/ResearchesTab'
import { ValidationsTab } from './ValidationsTab/ValidationsTab'

interface Props {
  address: string
  selectedTab: UserTypeContentTabsName
  name?: string
  publicationsCount?: number
  offsetsCount?: number
  reportsCount?: number
  researchesCount?: number
  coordinatesCount?: number
  pushCoord?: (data: PushCoordProps[]) => void
}

export function ContentTab({
  address,
  selectedTab,
  name,
  publicationsCount,
  offsetsCount,
  reportsCount,
  researchesCount,
  coordinatesCount,
  pushCoord
}: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return (
    <Tab
      address={address}
      name={name}
      publicationsCount={publicationsCount}
      offsetsCount={offsetsCount}
      reportsCount={reportsCount}
      researchesCount={researchesCount}
      coordinatesCount={coordinatesCount}
      pushCoord={pushCoord}
    />
  )
}

const tabs = {
  invitation: InvitationTab,
  certificates: CertificatesTab,
  publications: PublicationsTab,
  offsets: OffsetsTab,
  reports: ReportsTab,
  researches: ResearchesTab,
  regenerationArea: RegenerationAreaTab,
  approvedInvites: ApprovedInvites,
  inspections: InspectionsHistoryTab,
  validations: ValidationsTab
}

export type UserTypeContentTabsName = keyof typeof tabs
