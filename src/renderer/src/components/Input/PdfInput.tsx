/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { uploadToIpfs } from '@renderer/services/ipfs'
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Loading } from '../Loading/Loading'

interface Props {
  onChangeFile: (file: Blob) => void
  idInput?: string
  upload?: boolean
  setHash: (hash: string) => void
}

export function PdfInput({ onChangeFile, idInput = '1', upload, setHash }: Props): JSX.Element {
  const { ipfsApiUrl } = useSettingsContext()
  const { t } = useTranslation()
  const [nameFile, setNameFile] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)
  const [fileHash, setFileHash] = useState('')

  function handleOpenBrowserFind(): void {
    const input = document.querySelector(`#input-pdf-${idInput}`)
    if (!input) return
    //@ts-ignore
    input.click()
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
    if (!e.target.files) return
    const file = e.target.files[0]
    setNameFile(file.name)
    const blob = new Blob([file], { type: 'application/pdf' })
    if (upload) {
      uploadFileToIpfs(blob)
    } else {
      onChangeFile(blob)
    }
  }

  async function uploadFileToIpfs(file: Blob): Promise<void> {
    if (!file) return
    setUploadingFile(true)
    const response = await uploadToIpfs({ file, ipfsApiUrl })
    setUploadingFile(false)

    if (response.success) {
      setHash(response.hash)
      setFileHash(response.hash)
    } else {
      setFileHash('')
      toast(t('ipfs.errorOnUploadFile'), { type: 'error' })
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="text-white hidden"
        id={`input-pdf-${idInput}`}
      />

      <div className="flex items-center gap-3">
        <button
          className="px-10 h-10 rounded-2xl text-white font-semibold bg-green-btn w-fit hover:cursor-pointer"
          onClick={handleOpenBrowserFind}
        >
          {t('common.selectFile')}
        </button>

        {nameFile !== '' && <p className="text-white">{nameFile}</p>}

        {uploadingFile && <Loading size={50} />}
      </div>

      {fileHash !== '' && <p className="text-white">HASH: {fileHash}</p>}
    </div>
  )
}
