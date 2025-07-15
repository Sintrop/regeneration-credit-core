import { ApprovedInvites } from './ApprovedInvites/ApprovedInvites'
import { CertificatesTab } from './CertificatesTab/CertificatesTab'
import { ContributionsTab } from './ContributionsTab/ContributionsTab'
import { InspectionsHistoryTab } from './InspectionsHistory/InspectionsHistoryTab'
import { InvitationTab } from './InvitationTab'
import { OffsetsTab } from './OffsetsTab/OffsetsTab'
import { PublicationsTab } from './PublicationsTab/PublicationsTab'
import { ReductionCommitmentsTab } from './ReductionCommitmentsTab/ReductionCommitmentsTab'
import { RegenerationAreaTab } from './RegenerationAreaTab/RegenerationAreaTab'
import { ReportsTab } from './ReportsTab/ReportsTab'
import { ResearchesTab } from './ResearchesTab/ResearchesTab'
import { ValidationsTab } from './ValidationsTab/ValidationsTab'

interface Props {
  address: string
  selectedTab: UserTypeContentTabsName
  name?: string
  offsetsCount?: number
}

export function ContentTab({ address, selectedTab, name, offsetsCount }: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return <Tab address={address} name={name} offsetsCount={offsetsCount} />
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
  validations: ValidationsTab,
  contributions: ContributionsTab,
  reductionCommitments: ReductionCommitmentsTab
}

export type UserTypeContentTabsName = keyof typeof tabs
