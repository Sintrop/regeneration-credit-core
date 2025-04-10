/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onChangeFile: (file: Blob) => void
}

export function PdfInput({ onChangeFile }: Props): JSX.Element {
  const { t } = useTranslation()
  const [nameFile, setNameFile] = useState('')

  function handleOpenBrowserFind(): void {
    const input = document.querySelector('#input-pdf')
    if (!input) return
    //@ts-ignore
    input.click()
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
    if (!e.target.files) return
    const file = e.target.files[0]
    setNameFile(file.name)
    const blob = new Blob([file], { type: 'application/pdf' })
    onChangeFile(blob)
  }

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="text-white hidden"
        id="input-pdf"
      />

      <div className="flex items-center gap-3">
        <button
          className="px-10 h-10 rounded-2xl text-white font-semibold bg-green-btn w-fit hover:cursor-pointer"
          onClick={handleOpenBrowserFind}
        >
          {t('selectPDF')}
        </button>

        {nameFile !== '' && <p className="text-white">{nameFile}</p>}
      </div>
    </div>
  )
}
