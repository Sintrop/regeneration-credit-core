import { ReactNode } from 'react'
import { Header } from '../Header/Header'
import { RpcStatusBanner } from '../RpcStatusBanner/RpcStatusBanner'
import { SideMenu } from '../SideMenu/SideMenu'

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
          <div className="px-6 pt-6 empty:hidden">
            <RpcStatusBanner />
          </div>
          <div className="flex gap-6 px-6 py-6 pb-12">
            <div className="flex-1 min-w-0">{children}</div>
            {rightRail && (
              <aside className="w-[320px] shrink-0 flex flex-col gap-4">{rightRail}</aside>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
