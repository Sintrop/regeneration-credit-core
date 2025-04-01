import { TabItem } from '@renderer/components/TabItem/TabItem'
import { ContractPageTabs } from '../ContentTabs/ContentTabs'
import { useTranslation } from 'react-i18next'

interface Props {
  selectedTab: ContractPageTabs
  onChange: (tab: ContractPageTabs) => void
}

export function SelectorTabContract({ onChange, selectedTab }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-5 my-5">
      <TabItem
        label={t('methods')}
        onChange={(value) => onChange(value as ContractPageTabs)}
        value="methods"
        isSelected={selectedTab === 'methods'}
      />
    </div>
  )
}
