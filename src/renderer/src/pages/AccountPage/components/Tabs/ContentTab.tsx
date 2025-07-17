import { ApprovedInvites } from './ApprovedInvites/ApprovedInvites'
import { CertificatesTab } from './CertificatesTab/CertificatesTab'
import { ContributionsTab } from './ContributionsTab/ContributionsTab'
import { InspectionsHistoryTab } from './InspectionsHistory/InspectionsHistoryTab'
import { ReductionCommitmentsTab } from './ReductionCommitmentsTab/ReductionCommitmentsTab'
import { ReportsTab } from './ReportsTab/ReportsTab'
import { ResearchesTab } from './ResearchesTab/ResearchesTab'
import { ValidationsTab } from './ValidationsTab/ValidationsTab'

interface Props {
  address: string
  selectedTab: UserTypeContentTabsName
  name?: string
  userType: number
}

export function ContentTab({ address, selectedTab, name, userType }: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return <Tab address={address} name={name} userType={userType} />
}

const tabs = {
  certificates: CertificatesTab,
  reports: ReportsTab,
  researches: ResearchesTab,
  approvedInvites: ApprovedInvites,
  validations: ValidationsTab,
  contributions: ContributionsTab,
  reductionCommitments: ReductionCommitmentsTab,
  inspections: InspectionsHistoryTab
}

export type UserTypeContentTabsName = keyof typeof tabs
