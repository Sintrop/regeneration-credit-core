import { Icon, IconName } from '@renderer/components/Icon/Icon'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export function Nav(): JSX.Element {
  return (
    <nav className="flex flex-col">
      <NavItem icon="dashboard" label="feed" path="/" />
      <NavItem icon="contracts" label="contracts" path="/contracts" />
      <NavItem icon="pools" label="pools" path="/pools" />
      <NavItem icon="myTokens" label="myTokens" path="/my-tokens" />
      <NavItem icon="rcStats" label="tokenImpact" path="/rcstats" />
      <DropdownMenu label="community" icon="community" pathMainPage="/community" haveMainPage>
        <NavItem label="regenerators" path="/users/1" />
        <NavItem label="inspectors" path="/users/2" />
        <NavItem label="researchers" path="/users/3" />
        <NavItem label="developers" path="/users/4" />
        <NavItem label="contributors" path="/users/5" />
        <NavItem label="activists" path="/users/6" />
        <NavItem label="supporters" path="/users/7" />
      </DropdownMenu>
      <DropdownMenu label="resources" icon="computer">
        <NavItem icon="inspections" label="inspections" path="/inspections" />
        <NavItem icon="researches" label="researches" path="/researches" />
        <NavItem icon="development" label="development" path="/development" />
        <NavItem icon="contributions" label="contributions" path="/contributions" />
      </DropdownMenu>
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
      {icon && <Icon name={icon} size={25} />}
      {t(label)}
    </button>
  )
}

interface DropdownMenuProps {
  label: string
  icon?: IconName
  children: React.ReactNode
  haveMainPage?: boolean
  pathMainPage?: string
}
function DropdownMenu({
  label,
  icon,
  children,
  haveMainPage,
  pathMainPage
}: DropdownMenuProps): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleOpenMenu(): void {
    setMenuOpen((value) => !value)
  }

  function handleGoToMainPage(): void {
    navigate(pathMainPage ? pathMainPage : '/')
  }

  return (
    <div className={`flex flex-col`}>
      <button
        className="flex items-center justify-between w-full gap-3 py-3 text-white font-semibold hover:cursor-pointer"
        onClick={haveMainPage ? handleGoToMainPage : toggleOpenMenu}
      >
        <div className="flex items-center gap-3">
          {icon && <Icon name={icon} />}
          {t(label)}
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation()
            toggleOpenMenu()
          }}
          className="z-20 p-2 rounded-md hover:cursor-pointer hover:bg-green-900 duration-300"
        >
          {menuOpen ? <FaChevronUp color="white" /> : <FaChevronDown color="white" />}
        </div>
      </button>

      {menuOpen && <div className="flex flex-col ml-10">{children}</div>}
    </div>
  )
}
