import { useTranslation } from 'react-i18next'
import { FaRegCopy } from 'react-icons/fa'
import { toast } from 'react-toastify'

/** A labelled value that copies itself on click. */
export function CopyRow({
  label,
  value,
  mono
}: {
  label?: string
  value: string
  mono?: boolean
}): JSX.Element {
  const { t } = useTranslation()
  return (
    <button
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-card-secondary text-left hover:ring-1 hover:ring-green-primary/50 hover:cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(value)
        toast.success(t('common.copiedToClipboard'))
      }}
      title={t('help.copy')}
    >
      <span className="flex-1 min-w-0">
        {label && <span className="block text-gray-400 text-xs">{label}</span>}
        <span
          className={`block text-sm break-all ${mono ? 'text-green-primary font-mono' : 'text-white'}`}
        >
          {value}
        </span>
      </span>
      <FaRegCopy className="shrink-0 text-gray-300" size={14} />
    </button>
  )
}
