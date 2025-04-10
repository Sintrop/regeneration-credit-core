import { Icon, IconName } from '@renderer/components/Icon/Icon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function Nav(): JSX.Element {
  return (
    <nav className="flex flex-col">
      <NavItem icon="dashboard" label="dashboard" path="/" />
      <NavItem icon="sheet" label="contracts" path="/contracts" />
      <NavItem icon="userCircle" label="pools" path="/pools" />
      <NavItem icon="sheetCheck" label="inspections" path="/inspections" />
      <NavItem icon="circles" label="myTokens" path="/my-tokens" />
      <NavItem icon="graphSquare" label="rcStats" path="/rcstats" />
      <NavItem icon="computer" label="development" path="/development" />
      <NavItem label="contributions" path="/contributions" />
      <NavItem icon="sheetSearch" label="researches" path="/researches" />
      <NavItem icon="users" label="community" path="/community" />
      <NavItem label="actions" path="/actions" />
    </nav>
  )
}

interface NavItemProps {
  label: string
  path: string
  icon?: IconName
}
function NavItem({ label, path, icon }: NavItemProps): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()

  function handleNavigateTo(): void {
    navigate(path)
  }

  return (
    <button
      className="flex items-center gap-3 py-3 text-white font-semibold hover:cursor-pointer"
      onClick={handleNavigateTo}
    >
      {icon && <Icon name={icon} />}
      {t(label)}
    </button>
  )
}
