import { CertificatesTab } from './CertificatesTab/CertificatesTab'
import { InvitationTab } from './InvitationTab'
import { OffsetsTab } from './OffsetsTab/OffsetsTab'
import { PublicationsTab } from './PublicationsTab/PublicationsTab'
import { ReportsTab } from './ReportsTab/ReportsTab'
import { ResearchesTab } from './ResearchesTab/ResearchesTab'

interface Props {
  address: string
  selectedTab: UserTypeContentTabsName
  name?: string
  publicationsCount?: number
  offsetsCount?: number
  reportsCount?: number
  researchesCount?: number
}

export function ContentTab({
  address,
  selectedTab,
  name,
  publicationsCount,
  offsetsCount,
  reportsCount,
  researchesCount
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
    />
  )
}

const tabs = {
  invitation: InvitationTab,
  certificates: CertificatesTab,
  publications: PublicationsTab,
  offsets: OffsetsTab,
  reports: ReportsTab,
  researches: ResearchesTab
}

export type UserTypeContentTabsName = keyof typeof tabs
