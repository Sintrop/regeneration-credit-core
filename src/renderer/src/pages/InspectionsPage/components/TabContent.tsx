import { InspectionsTab } from './InspectionsTab/InspectionsTab'

interface Props {
  selectedTab: InspectionsTabs
}

export function TabContent({ selectedTab }: Props): JSX.Element {
  const Tab = tabs[selectedTab]

  return <Tab />
}

const tabs = {
  inspections: InspectionsTab
}

export type InspectionsTabs = keyof typeof tabs
