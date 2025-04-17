import { CertificatesTab } from './CertificatesTab/CertificatesTab'
import { InvitationTab } from './InvitationTab'
import { OffsetsTab } from './OffsetsTab/OffsetsTab'
import { PublicationsTab } from './PublicationsTab/PublicationsTab'

interface Props {
  address: string
  selectedTab: UserTypeContentTabsName
  name?: string
  publicationsCount?: number
  offsetsCount?: number
}

export function ContentTab({
  address,
  selectedTab,
  name,
  publicationsCount,
  offsetsCount
}: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return (
    <Tab
      address={address}
      name={name}
      publicationsCount={publicationsCount}
      offsetsCount={offsetsCount}
    />
  )
}

const tabs = {
  invitation: InvitationTab,
  certificates: CertificatesTab,
  publications: PublicationsTab,
  offsets: OffsetsTab
}

export type UserTypeContentTabsName = keyof typeof tabs
