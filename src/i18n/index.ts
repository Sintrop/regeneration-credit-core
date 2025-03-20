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

const config = {
  resources: resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  }
}

i18n.use(initReactI18next).init(config)

export default i18n
