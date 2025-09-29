import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TabItem } from '../TabItem/TabItem'
import { PdfInput } from '../Input/PdfInput'

interface Props {
  value: string
  setValue: (value: string) => void
  inputId?: string
}
export function FileInputSelector({ setValue, value, inputId }: Props): JSX.Element {
  const { t } = useTranslation()
  const [fileType, setFileType] = useState<string>('file')

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-5">
        <TabItem
          label={t('fileInputSelector.file')}
          onChange={() => setFileType('file')}
          value="file"
          isSelected={fileType === 'file'}
        />

        <TabItem
          label={t('fileInputSelector.url')}
          onChange={() => setFileType('url')}
          value="url"
          isSelected={fileType === 'url'}
        />
      </div>

      <div className="flex flex-col gap-1 mt-3">
        {fileType === 'file' && (
          <PdfInput onChangeFile={() => {}} setHash={setValue} idInput={inputId} upload />
        )}
        {fileType === 'url' && (
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm">URL</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('common.typeHere')}
              className="w-full h-10 px-3 rounded-2xl bg-container-secondary text-white"
            />
          </div>
        )}
      </div>
    </div>
  )
}
