import { InvitationTab } from './InvitationTab'

interface Props {
  address: string
  selectedTab: UserTypeContentTabsName
}

export function ContentTab({ address, selectedTab }: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return <Tab address={address} />
}

const tabs = {
  invitationTab: InvitationTab
}

export type UserTypeContentTabsName = keyof typeof tabs
