import { ContractListProps } from '@renderer/types/contract'
import { MethodsTab } from '../MethodsTab/MethodsTab'

interface Props {
  selectedTab: ContractPageTabs
  contract: ContractListProps
}
export function ContentTabs({ selectedTab, contract }: Props): JSX.Element {
  const Tab = contractPageTabs[selectedTab]

  return <Tab contract={contract} />
}

const contractPageTabs = {
  methods: MethodsTab
}

export type ContractPageTabs = keyof typeof contractPageTabs
