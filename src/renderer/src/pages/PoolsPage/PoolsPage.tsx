import { useTranslation } from 'react-i18next'
import { PoolItem } from './components/PoolItem'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'

export function PoolsPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <ScreenPage pageTitle={t('pools')}>
      <div className="flex flex-col gap-5 mb-10">
        <PoolItem poolName="regenerator" />
        <PoolItem poolName="inspector" />
        <PoolItem poolName="researcher" />
        <PoolItem poolName="developer" />
        <PoolItem poolName="contributor" />
        <PoolItem poolName="activist" />
      </div>
    </ScreenPage>
  )
}
