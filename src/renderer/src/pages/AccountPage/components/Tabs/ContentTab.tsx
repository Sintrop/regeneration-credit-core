import { CertificatesTab } from './CertificatesTab/CertificatesTab'
import { InvitationTab } from './InvitationTab'
import { OffsetsTab } from './OffsetsTab/OffsetsTab'
import { PublicationsTab } from './PublicationsTab/PublicationsTab'
import { ReportsTab } from './ReportsTab/ReportsTab'

interface Props {
  address: string
  selectedTab: UserTypeContentTabsName
  name?: string
  publicationsCount?: number
  offsetsCount?: number
  reportsCount?: number
}

export function ContentTab({
  address,
  selectedTab,
  name,
  publicationsCount,
  offsetsCount,
  reportsCount
}: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return (
    <Tab
      address={address}
      name={name}
      publicationsCount={publicationsCount}
      offsetsCount={offsetsCount}
      reportsCount={reportsCount}
    />
  )
}

const tabs = {
  invitation: InvitationTab,
  certificates: CertificatesTab,
  publications: PublicationsTab,
  offsets: OffsetsTab,
  reports: ReportsTab
}

export type UserTypeContentTabsName = keyof typeof tabs
