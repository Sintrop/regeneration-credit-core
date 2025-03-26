import { ReactNode } from 'react'
import { Header } from '../Header/Header'
import { SideMenu } from '../SideMenu/SideMenu'
import { PageTitle } from '../PageTitle/PageTitle'

interface Props {
  pageTitle: string
  children: ReactNode
}

export function ScreenPage({ children, pageTitle }: Props): JSX.Element {
  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex w-screen h-screen overflow-y-auto">
        <SideMenu />

        <div className="flex flex-col gap-10 py-30 pl-[320px] w-full pr-5">
          <PageTitle title={pageTitle} />
          {children}
        </div>
      </main>
    </>
  )
}
