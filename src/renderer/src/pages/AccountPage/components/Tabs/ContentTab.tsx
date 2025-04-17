import { CertificatesTab } from './CertificatesTab/CertificatesTab'
import { InvitationTab } from './InvitationTab'
import { PublicationsTab } from './PublicationsTab/PublicationsTab'

interface Props {
  address: string
  selectedTab: UserTypeContentTabsName
  name?: string
  publicationsCount?: number
}

export function ContentTab({ address, selectedTab, name, publicationsCount }: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return <Tab address={address} name={name} publicationsCount={publicationsCount} />
}

const tabs = {
  invitation: InvitationTab,
  certificates: CertificatesTab,
  publications: PublicationsTab
}

export type UserTypeContentTabsName = keyof typeof tabs
