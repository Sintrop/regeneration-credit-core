import { Header } from '@renderer/components/Header/Header'
import { PageTitle } from '@renderer/components/PageTitle/PageTitle'
import { SideMenu } from '@renderer/components/SideMenu/SideMenu'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ContractPoolData } from './components/ContractPoolData'
import { ContractsPoolName } from './contractsPoolList'

export function PoolPage(): JSX.Element {
  const { t } = useTranslation()
  const params = useParams()
  const poolName = params.poolName as ContractsPoolName

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex w-screen h-screen overflow-y-auto">
        <SideMenu />

        <div className="flex flex-col gap-10 py-30 pl-[320px]">
          <PageTitle title={t(poolName)} />
          <ContractPoolData poolName={poolName} />
        </div>
      </main>
    </>
  )
}
