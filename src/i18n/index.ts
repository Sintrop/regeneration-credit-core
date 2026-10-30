import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import PT from './locales/pt.json'
import EN from './locales/en.json'

const resources = {
  en: {
    translation: EN
  },
  pt: {
    translation: PT
  }
}

/** Most users are in Brazil, so a fresh install starts in Portuguese; the choice in Settings is saved and wins after that. */
const DEFAULT_LANGUAGE = 'pt'

function savedLanguage(): string {
  try {
    return localStorage.getItem('language') || DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

const config = {
  resources: resources,
  lng: savedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
}

i18n.use(initReactI18next).init(config)

export default i18n
