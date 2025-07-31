import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { CategoryItem } from './components/CategoryItem'
import { useTranslation } from 'react-i18next'

export function RcIndexPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <ScreenPage pageTitle={t('rcIndex.title')}>
      <div className="flex flex-wrap gap-5">
        <CategoryItem categoryId={1} />
        <CategoryItem categoryId={2} />
      </div>
    </ScreenPage>
  )
}
