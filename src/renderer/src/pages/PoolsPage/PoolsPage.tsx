import { Header } from '@renderer/components/Header/Header'
import { PageTitle } from '@renderer/components/PageTitle/PageTitle'
import { SideMenu } from '@renderer/components/SideMenu/SideMenu'
import { useTranslation } from 'react-i18next'
import { PoolItem } from './components/PoolItem'

export function PoolsPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex w-screen h-screen overflow-y-auto">
        <SideMenu />

        <div className="flex flex-col gap-10 py-30 pl-[320px]">
          <PageTitle title={t('pools')} />

          <div className="flex flex-wrap gap-10">
            <PoolItem poolName="regenerator" />
            <PoolItem poolName="inspector" />
            <PoolItem poolName="researcher" />
            <PoolItem poolName="developer" />
            <PoolItem poolName="contributor" />
            <PoolItem poolName="activist" />
          </div>
        </div>
      </main>
    </>
  )
}
