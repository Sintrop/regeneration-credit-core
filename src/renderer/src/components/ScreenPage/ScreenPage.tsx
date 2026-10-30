import { ReactNode } from 'react'
import { Header } from '../Header/Header'
import { SideMenu } from '../SideMenu/SideMenu'
import { ActionBar } from './components/ActionBar/ActionBar'

interface Props {
  pageTitle: string
  children: ReactNode
  /** Optional column on the right, e.g. the account and network summary on Home. */
  rightRail?: ReactNode
}

export function ScreenPage({ children, pageTitle, rightRail }: Props): JSX.Element {
  return (
    <div className="flex w-screen h-screen bg-background">
      <SideMenu />

      <div className="flex flex-col flex-1 min-w-0 ml-[248px]">
        <Header title={pageTitle} />

        <main className="flex-1 overflow-y-auto">
          <div className="flex gap-6 px-6 py-6 pb-32">
            <div className="flex-1 min-w-0">{children}</div>
            {rightRail && (
              <aside className="w-[320px] shrink-0 flex flex-col gap-4">{rightRail}</aside>
            )}
          </div>
        </main>

        <ActionBar />
      </div>
    </div>
  )
}
