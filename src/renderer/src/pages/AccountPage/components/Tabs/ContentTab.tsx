import { CertificatesTab } from './CertificatesTab/CertificatesTab'
import { InvitationTab } from './InvitationTab'

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
  certificates: CertificatesTab
}

export type UserTypeContentTabsName = keyof typeof tabs
