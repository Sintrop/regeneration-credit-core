import { useContext } from 'react'
import { SettingsContext, SettingsContextProps } from '@renderer/contexts/SettingsContext'

export function useSettingsContext(): SettingsContextProps {
  const context = useContext(SettingsContext)
  return context
}
