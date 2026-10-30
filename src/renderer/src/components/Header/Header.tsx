import { ActionsMenu } from './components/ActionsMenu'
import { ChainSwitch } from './components/ChainSwitch'
import { DocsLink } from './components/DocsLink'
import { EraChip } from './components/EraChip'
import { HelpLink } from './components/HelpLink'
import { LanguageSwitch } from './components/LanguageSwitch'
import { NavBtns } from '../ScreenPage/components/NavBtns'
import { ConnectionWalletButton } from '../ScreenPage/components/ActionBar/ConnectionWalletButton'

interface Props {
  title: string
}

export function Header({ title }: Props): JSX.Element {
  return (
    <header className="relative z-30 h-16 shrink-0 flex items-center justify-between gap-4 px-6 border-b border-card-primary bg-green-header/80 backdrop-blur">
      <div className="flex items-center gap-4 min-w-0">
        <NavBtns />
        <h1 className="text-white font-bold text-xl truncate min-w-[96px]">{title}</h1>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <ActionsMenu />
        <EraChip />
        <LanguageSwitch />
        <HelpLink />
        <DocsLink />
        <ChainSwitch />
        <ConnectionWalletButton />
      </div>
    </header>
  )
}
