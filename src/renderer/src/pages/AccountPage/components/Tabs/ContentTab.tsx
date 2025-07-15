import { ApprovedInvites } from './ApprovedInvites/ApprovedInvites'
import { CertificatesTab } from './CertificatesTab/CertificatesTab'
import { ContributionsTab } from './ContributionsTab/ContributionsTab'
import { InvitationTab } from './InvitationTab'
import { ReductionCommitmentsTab } from './ReductionCommitmentsTab/ReductionCommitmentsTab'
import { RegenerationAreaTab } from './RegenerationAreaTab/RegenerationAreaTab'
import { ReportsTab } from './ReportsTab/ReportsTab'
import { ResearchesTab } from './ResearchesTab/ResearchesTab'
import { ValidationsTab } from './ValidationsTab/ValidationsTab'

interface Props {
  address: string
  selectedTab: UserTypeContentTabsName
  name?: string
}

export function ContentTab({ address, selectedTab, name }: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return <Tab address={address} name={name} />
}

const tabs = {
  invitation: InvitationTab,
  certificates: CertificatesTab,
  reports: ReportsTab,
  researches: ResearchesTab,
  regenerationArea: RegenerationAreaTab,
  approvedInvites: ApprovedInvites,
  validations: ValidationsTab,
  contributions: ContributionsTab,
  reductionCommitments: ReductionCommitmentsTab
}

export type UserTypeContentTabsName = keyof typeof tabs
