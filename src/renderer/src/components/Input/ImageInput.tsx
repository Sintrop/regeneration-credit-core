/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange: (image: string) => void
}
export function ImageInput({ onChange }: Props): JSX.Element {
  const { t } = useTranslation()
  const [image, setImage] = useState<string>()

  function handleOpenBroswerFile(): void {
    const input = document.querySelector('#input-img')
    if (!input) return
    //@ts-ignore
    input.click()
  }

  function handleChangeImage(e: ChangeEvent<HTMLInputElement>): void {
    if (!e.target.files) return

    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (): void => {
      onChange(reader?.result as string)
      setImage(reader.result as string)
    }
    reader.onerror = (): void => {
      alert('error on transforming image to base64')
    }
  }

  return (
    <div className="flex flex-col">
      <input
        id="input-img"
        type="file"
        className="hidden"
        onChange={handleChangeImage}
        accept="image/*"
      />

      {image && <img src={image as string} className="w-32 h-32 rounded-2xl object-cover mb-5" />}

      <button
        className="rounded-2xl bg-green-primary text-white font-semibold px-10 w-fit h-8 hover:cursor-pointer"
        onClick={handleOpenBroswerFile}
      >
        {t('selectImage')}
      </button>
    </div>
  )
}
