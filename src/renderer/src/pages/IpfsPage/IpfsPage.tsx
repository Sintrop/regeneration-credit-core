/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { uploadToIpfs } from '@renderer/services/ipfs'
import { ChangeEvent, JSX, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegCopy } from 'react-icons/fa'

export function IpfsPage(): JSX.Element {
  const { ipfsApiUrl } = useSettingsContext()
  const { t } = useTranslation()
  const [file, setFile] = useState<FileList>()
  const [loading, setLoading] = useState(false)
  const [hash, setHash] = useState('')

  function fileChanged(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      setFile(e.target.files)
    }
  }

  function handleSelectFile(): void {
    const input = document.querySelector('#input-file')
    if (input) {
      //@ts-ignore
      input.click()
    }
  }

  function handleCopyHash(): void {
    navigator.clipboard.writeText(hash)
    alert(t('hashCopiedToClipboard'))
  }

  async function handleUpload(): Promise<void> {
    if (!file || file.length === 0) return
    setHash('')
    setLoading(true)
    const response = await uploadToIpfs({ file: file[0], ipfsApiUrl })
    if (response.success) {
      setHash(response.hash)
    } else {
      alert(t('errorOnUploadFile'))
    }
    setLoading(false)
  }

  return (
    <ScreenPage pageTitle="IPFS">
      <p className="text-gray-300">{t('uploadFileToIPFS')}</p>
      <div className="flex items-center gap-5">
        <button
          className="px-10 h-10 rounded-2xl w-fit bg-blue-500 text-white hover:cursor-pointer"
          onClick={handleSelectFile}
        >
          {t('selectFile')}
        </button>
        <input
          id="input-file"
          type="file"
          onChange={fileChanged}
          className="hidden"
          accept="image/*, application/pdf"
        />

        {file && <>{file?.length > 0 && <p className="text-white">{file[0].name}</p>}</>}
      </div>

      <button
        className="flex items-center justify-center mt-5 bg-green-primary rounded-2xl text-white h-10 hover:cursor-pointer disabled:cursor-default disabled:opacity-40 w-[300px]"
        onClick={handleUpload}
        disabled={!file || file.length === 0 || loading}
      >
        {loading ? <div className="w-7 h-7 bg-blue-500 animate-spin" /> : t('upload')}
      </button>

      {hash !== '' && (
        <div className="flex items-center gap-1 mt-3">
          <p className="text-white">HASH: </p>
          <p className="text-white font-semibold">{hash}</p>
          <button className="hover:cursor-pointer ml-5" onClick={handleCopyHash}>
            <FaRegCopy size={25} color="white" />
          </button>
        </div>
      )}
    </ScreenPage>
  )
}
