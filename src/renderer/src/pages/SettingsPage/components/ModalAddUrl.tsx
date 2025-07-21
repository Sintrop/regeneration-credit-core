import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdClose } from 'react-icons/md'

interface Props {
  close: () => void
  add: (url: string) => void
}

export function ModalAddUrl({ close, add }: Props): JSX.Element {
  const { t } = useTranslation()
  const [url, setUrl] = useState<string>('')

  function handleAdd(): void {
    if (!url.trim()) return
    if (!url.includes('http://') && !url.includes('https://')) {
      alert('typeAnValidUrl')
      return
    }

    if (url.charAt(url.length - 1) === '/') {
      alert('theUrlCanNotEndWith/')
      return
    }

    add(url)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-green-card p-6 rounded-2xl shadow-2xl w-96 relative">
        <p className="text-white text-center">Add URL</p>
        <button className="absolute top-3 right-3 hover:cursor-pointer" onClick={close}>
          <MdClose size={25} color="white" />
        </button>

        <label className="text-gray-300 text-sm mt-5">URL:</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('typeHere')}
          className="w-full h-10 rounded-2xl bg-container-secondary px-3 text-white"
        />

        <button
          className="w-full mt-5 h-10 rounded-2xl bg-blue-primary font-semibold text-white hover:cursor-pointer disabled:opacity-50 disabled:cursor-default"
          onClick={handleAdd}
          disabled={!url.trim()}
        >
          Add
        </button>
      </div>
    </div>
  )
}
