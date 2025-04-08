import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function Nav(): JSX.Element {
  return (
    <nav className="flex flex-col">
      <NavItem label="dashboard" path="/" />
      <NavItem label="contracts" path="/contracts" />
      <NavItem label="pools" path="/pools" />
      <NavItem label="inspections" path="/inspections" />
      <NavItem label="myTokens" path="/my-tokens" />
      <NavItem label="rcStats" path="/rcstats" />
      <NavItem label="development" path="/development" />
      <NavItem label="contributions" path="/contributions" />
      <NavItem label="researches" path="/researches" />
    </nav>
  )
}

interface NavItemProps {
  label: string
  path: string
  icon?: string
}
function NavItem({ label, path }: NavItemProps): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()

  function handleNavigateTo(): void {
    navigate(path)
  }

  return (
    <button
      className="flex items-center gap-5 py-3 text-white font-semibold hover:cursor-pointer"
      onClick={handleNavigateTo}
    >
      <div className="w-5 h-5 bg-red-500" />
      {t(label)}
    </button>
  )
}
