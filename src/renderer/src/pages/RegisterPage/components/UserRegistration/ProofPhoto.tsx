/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useTranslation } from 'react-i18next'
import { WebCam } from '@renderer/components/WebCam/WebCam'

interface Props {
  proofPhoto: string
  onChange: (url: string) => void
}
export function ProofPhoto({ proofPhoto, onChange }: Props): JSX.Element {
  const { t } = useTranslation()

  function openBrowserFile(): void {
    const inputFile = document.querySelector('#input-file')
    //@ts-ignore
    if (inputFile) inputFile.click()
  }

  function handleChangeProofPhoto(base64: string | ImageData): void {
    onChange(base64 as string)
  }

  return (
    <div className="flex flex-col">
      <p className="text-gray-300 text-sm mt-10">{t('proofPhoto')}</p>
      <input
        id="input-file"
        type="file"
        onChange={(e) => console.log(e.target.files)}
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
