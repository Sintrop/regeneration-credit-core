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
      className="px-5 h-10 rounded-2xl bg-card-1 text-white font-semibold hover:cursor-pointer flex items-center justify-center gap-3"
    >
      <LuLibraryBig size={20} color="white" />
      {t('header.docs')}
    </button>
  )
}
