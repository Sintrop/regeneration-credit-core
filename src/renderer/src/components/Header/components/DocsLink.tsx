import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { LuLibraryBig } from 'react-icons/lu'

export function DocsLink(): JSX.Element {
  const { t } = useTranslation()

  function handleCopyUrl(): void {
    navigator.clipboard.writeText('https://docs.regenerationcredit.org')
    toast(t('common.urlCopiedToClipboard'), { type: 'success' })
  }

  return (
    <button
      onClick={handleCopyUrl}
      className="w-9 h-9 rounded-xl bg-card-primary hover:cursor-pointer flex items-center justify-center"
      title={t('header.docs')}
    >
      <LuLibraryBig size={18} color="white" />
    </button>
  )
}
