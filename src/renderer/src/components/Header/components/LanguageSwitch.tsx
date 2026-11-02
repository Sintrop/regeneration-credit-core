import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown } from 'react-icons/fa'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

const LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
]

export function LanguageSwitch(): JSX.Element {
  const { i18n } = useTranslation()
  const { handleChangeLanguage } = useSettingsContext()
  const [open, setOpen] = useState(false)
  const available = LANGUAGES.filter((item) => i18n.hasResourceBundle(item.code, 'translation'))
  const current = i18n.language.slice(0, 2)

  function select(code: string): void {
    setOpen(false)
    if (code !== current) handleChangeLanguage(code)
  }

  return (
    <div className="relative">
      <button
        className="h-9 px-3 rounded-xl bg-card-primary text-white text-sm font-semibold hover:cursor-pointer flex items-center gap-2"
        onClick={() => setOpen((value) => !value)}
      >
        {current.toUpperCase()}
        <FaChevronDown size={10} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-40 p-1 rounded-xl bg-card-primary border border-card-secondary shadow-xl z-50">
          {available.map((item) => (
            <button
              key={item.code}
              className={`w-full text-left px-3 h-9 rounded-lg text-sm hover:cursor-pointer hover:bg-card-secondary ${
                item.code === current ? 'text-green-primary font-semibold' : 'text-white'
              }`}
              onClick={() => select(item.code)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
