import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaExternalLinkAlt, FaRegCopy } from 'react-icons/fa'
import { MdUploadFile } from 'react-icons/md'
import { toast } from 'react-toastify'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { uploadToIpfs } from '@renderer/services/ipfs'

function CopyRow({
  label,
  value,
  copied
}: {
  label: string
  value: string
  copied: string
}): JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-gray-400 text-xs">{label}</span>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-card-secondary">
        <span className="flex-1 min-w-0 text-white text-sm font-mono truncate">{value}</span>
        <button
          className="p-1 text-gray-300 hover:text-white hover:cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(value)
            toast.success(copied)
          }}
        >
          <FaRegCopy size={15} />
        </button>
      </div>
    </div>
  )
}

export function IpfsPage(): JSX.Element {
  const { t } = useTranslation()
  const { ipfsApiUrl, ipfsGatewayURL } = useSettingsContext()
  const input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File>()
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [hash, setHash] = useState('')
  const url = `${ipfsGatewayURL}/ipfs/${hash}`

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      setPreview('')
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return (): void => URL.revokeObjectURL(objectUrl)
  }, [file])

  function choose(event: ChangeEvent<HTMLInputElement>): void {
    setFile(event.target.files?.[0])
    setHash('')
  }

  async function upload(): Promise<void> {
    if (!file) return
    setLoading(true)
    const response = await uploadToIpfs({ file, ipfsApiUrl })
    setLoading(false)
    if (response.success) setHash(response.hash)
    else toast.error(t('ipfs.errorOnUploadFile'))
  }

  return (
    <ScreenPage pageTitle="IPFS">
      <div className="max-w-[720px] mx-auto flex flex-col gap-5">
        <section className="p-6 rounded-2xl bg-card-primary flex flex-col gap-5">
          <div>
            <p className="text-white text-lg font-bold">{t('ipfs.uploadFileToIPFS')}</p>
            <p className="text-gray-300 text-sm">{t('ipfs.description')}</p>
          </div>

          <button
            className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-green-primary/40 hover:border-green-primary hover:cursor-pointer"
            onClick={() => input.current?.click()}
          >
            {preview ? (
              <img src={preview} className="max-h-48 rounded-lg object-contain" />
            ) : (
              <MdUploadFile className="text-green-primary" size={40} />
            )}
            <span className="text-white font-semibold">
              {file ? file.name : t('ipfs.selectFile')}
            </span>
            <span className="text-gray-400 text-xs">{t('ipfs.acceptedTypes')}</span>
          </button>
          <input
            ref={input}
            type="file"
            onChange={choose}
            className="hidden"
            accept="image/*, application/pdf"
          />

          <button
            className="h-12 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={upload}
            disabled={!file || loading}
          >
            {loading ? t('ipfs.uploading') : t('ipfs.upload')}
          </button>
        </section>

        {hash && (
          <section className="p-6 rounded-2xl bg-card-primary border border-green-primary/40 flex flex-col gap-4">
            <p className="text-green-primary font-bold">{t('ipfs.uploaded')}</p>
            <CopyRow label="Hash" value={hash} copied={t('ipfs.hashCopiedToClipboard')} />
            <CopyRow label="URL" value={url} copied={t('ipfs.urlCopiedToClipboard')} />
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="self-start flex items-center gap-2 text-green-primary text-sm font-semibold hover:underline"
            >
              {t('resourceDetails.openFile')}
              <FaExternalLinkAlt size={11} />
            </a>
          </section>
        )}
      </div>
    </ScreenPage>
  )
}
