import { Icon, IconName } from '@renderer/components/Icon/Icon'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export function Nav(): JSX.Element {
  return (
    <nav className="flex flex-col">
      <NavItem icon="dashboard" label="feed" path="/" />
      <NavItem icon="sheet" label="contracts" path="/contracts" />
      <NavItem icon="userCircle" label="pools" path="/pools" />
      <NavItem icon="circles" label="myTokens" path="/my-tokens" />
      <NavItem icon="graphSquare" label="rcStats" path="/rcstats" />
      <NavItem icon="users" label="community" path="/community" />
      <DropdownMenu label="resources" icon="computer">
        <NavItem icon="sheetCheck" label="inspections" path="/inspections" />
        <NavItem icon="sheetSearch" label="researches" path="/researches" />
        <NavItem icon="computer" label="development" path="/development" />
        <NavItem label="contributions" path="/contributions" />
      </DropdownMenu>
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

interface DropdownMenuProps {
  label: string
  icon?: IconName
  children: React.ReactNode
}
function DropdownMenu({ label, icon, children }: DropdownMenuProps): JSX.Element {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleOpenMenu(): void {
    setMenuOpen((value) => !value)
  }

  return (
    <div className={`flex flex-col`}>
      <button
        className="flex items-center justify-between w-full gap-3 py-3 text-white font-semibold hover:cursor-pointer"
        onClick={toggleOpenMenu}
      >
        <div className="flex items-center gap-3">
          {icon && <Icon name={icon} />}
          {t(label)}
        </div>

        {menuOpen ? <FaChevronUp color="white" /> : <FaChevronDown color="white" />}
      </button>

      {menuOpen && <div className="flex flex-col ml-10">{children}</div>}
    </div>
  )
}
