/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useTranslation } from 'react-i18next'
import { WebCam } from '@renderer/components/WebCam/WebCam'
import { ChangeEvent } from 'react'

interface Props {
  proofPhoto: string
  onChange: (url: string) => void
  labelProfilePhoto?: boolean
}
export function ProofPhoto({ proofPhoto, onChange, labelProfilePhoto }: Props): JSX.Element {
  const { t } = useTranslation()

  function openBrowserFile(): void {
    const inputFile = document.querySelector('#input-file')
    //@ts-ignore
    if (inputFile) inputFile.click()
  }

  function selectedImageFromBrowser(e: ChangeEvent<HTMLInputElement>): void {
    if (!e.target.files) return

    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (): void => {
      onChange(reader.result as string)
    }
    reader.onerror = (): void => {
      console.log('error on transforming image to base64')
    }
  }

  function handleChangeProofPhoto(base64: string | ImageData): void {
    onChange(base64 as string)
  }

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-green-card w-fit mt-8">
      <p className="text-gray-300 text-sm">
        {labelProfilePhoto ? t('profilePhoto') : t('proofPhoto')}
      </p>
      <input
        id="input-file"
        type="file"
        onChange={selectedImageFromBrowser}
        className="hidden"
        accept="image/*"
      />

      {proofPhoto && (
        <img src={proofPhoto as string} className="w-32 h-32 rounded-2xl object-cover mb-5" />
      )}

      <div className="flex items-center gap-5">
        <button
          className="rounded-2xl bg-blue-primary text-white font-semibold px-10 w-fit h-10 hover:cursor-pointer"
          onClick={openBrowserFile}
        >
          {t('selectImage')}
        </button>

        <WebCam imageTaken={handleChangeProofPhoto} />
      </div>
    </div>
  )
}
