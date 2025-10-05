import { JSX, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import i18n from '../../../../../i18n'

export function LanguageSwitch(): JSX.Element {
  const { language } = i18n
  const [showSelect, setShowSelect] = useState(false)
  const { handleChangeLanguage } = useSettingsContext()

  function toggleShowSelect(): void {
    setShowSelect((value) => !value)
  }

  function handleSwitchLang(lang: string): void {
    toggleShowSelect()
    if (lang !== language) handleChangeLanguage(lang)
  }

  return (
    <div className="flex flex-col relative">
      <button
        className="w-[180px] px-4 h-10 rounded-2xl bg-card-1 text-white font-semibold hover:cursor-pointer flex items-center justify-between gap-3 disabled:cursor-default"
        onClick={toggleShowSelect}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-card-2 rounded-full flex items-center justify-center">
            <p className="text-white">{language.toUpperCase()}</p>
          </div>
          <p className="text-white font-semibold text-sm">
            {language === 'en' && 'English'}
            {language === 'pt' && 'Português'}
          </p>
        </div>

        <FaChevronDown color="white" />
      </button>

      {showSelect && (
        <div className="absolute top-12 left-0 bg-card-1 w-[180px] p-4 rounded-2xl">
          <button
            className="flex items-center gap-2 p-2 border-b border-card-2 w-full hover:cursor-pointer hover:bg-card-3 duration-200"
            onClick={() => handleSwitchLang('en')}
          >
            <div className="w-8 h-8 bg-card-2 rounded-full flex items-center justify-center">
              <p className="text-white">EN</p>
            </div>
            <p className="text-white font-semibold text-sm">English</p>
          </button>

          <button
            className="flex items-center gap-2 p-2 border-b border-card-2 w-full hover:cursor-pointer hover:bg-card-3 duration-200"
            onClick={() => handleSwitchLang('pt')}
          >
            <div className="w-8 h-8 bg-card-2 rounded-full flex items-center justify-center">
              <p className="text-white">PT</p>
            </div>
            <p className="text-white font-semibold text-sm">Português</p>
          </button>
        </div>
      )}
    </div>
  )
}
