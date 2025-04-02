import { ReportsTab } from './ReportsTab/ReportsTab'

interface Props {
  selectedTab: DevelopmentTabs
}

export function TabContent({ selectedTab }: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return <Tab />
}

const tabs = {
  reports: ReportsTab
}

export type DevelopmentTabs = keyof typeof tabs
