import { ContributorsTab } from './ContributorsTab/ContributorsTab'
import { ContributionsTab } from './ContributionsTab/ContributionsTab'

interface Props {
  selectedTab: ContributionsTab
}

export function TabContent({ selectedTab }: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return <Tab />
}

const tabs = {
  contributions: ContributionsTab,
  contributors: ContributorsTab
}

export type ContributionsTab = keyof typeof tabs
