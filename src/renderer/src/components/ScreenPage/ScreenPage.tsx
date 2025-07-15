import { ReactNode } from 'react'
import { Header } from '../Header/Header'
import { SideMenu } from '../SideMenu/SideMenu'
import { PageTitle } from '../PageTitle/PageTitle'
import { InfoBar } from './components/InfoBar'
import { NavBtns } from './components/NavBtns'
import { ActionBar } from './components/ActionBar/ActionBar'

interface Props {
  pageTitle: string
  children: ReactNode
}

export function ScreenPage({ children, pageTitle }: Props): JSX.Element {
  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex w-screen h-screen">
        <SideMenu />

        <div className="flex flex-col pt-20 pl-[300px] w-full">
          <InfoBar />

          <div className="flex flex-col gap-10 pt-10 pl-5 w-full overflow-y-auto">
            <div className="flex flex-col gap-1">
              <NavBtns />
              <PageTitle title={pageTitle} />
            </div>
            <div className="mb-32 pr-1">{children}</div>
            <ActionBar />
          </div>
        </div>
      </main>
    </>
  )
}
