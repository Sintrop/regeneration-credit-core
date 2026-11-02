import { useTranslation } from 'react-i18next'
import { LuLibraryBig } from 'react-icons/lu'

/** Opens the documentation in the system browser. */
export function DocsLink(): JSX.Element {
  const { t } = useTranslation()
  return (
    <a
      href="https://docs.regenerationcredit.org"
      target="_blank"
      rel="noreferrer"
      className="w-9 h-9 rounded-xl bg-card-primary hover:bg-card-primary/70 flex items-center justify-center"
      title={t('header.docs')}
    >
      <LuLibraryBig size={18} color="white" />
    </a>
  )
}
