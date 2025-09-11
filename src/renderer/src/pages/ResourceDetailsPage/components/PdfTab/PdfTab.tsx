/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegCopy } from 'react-icons/fa'
import { pdfjs, Document, Page } from 'react-pdf'
import { toast } from 'react-toastify'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface Props {
  report?: string
}
export function PdfTab({ report }: Props): JSX.Element {
  const { t } = useTranslation()
  const { ipfsGatewayURL } = useSettingsContext()
  const [sourceUrl, setSourceUrl] = useState<string>('')
  const [numPages, setNumPages] = useState<number>(0)

  useEffect(() => {
    checkOriginSource()
  }, [report])

  function checkOriginSource(): void {
    if (report?.includes('http://') || report?.includes('https://')) {
      setSourceUrl(report)
    } else {
      setSourceUrl(`${ipfsGatewayURL}/ipfs/${report}`)
    }
  }

  function handleCopyUrl(): void {
    navigator.clipboard.writeText(sourceUrl)
    toast(t('common.urlCopiedToClipboard'), { type: 'success' })
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  function LoadingPdf(): JSX.Element {
    return (
      <div className="flex-1 items-center justify-center">
        <p className="text-white">loading file...</p>
      </div>
    )
  }

  function ErrorPdf(): JSX.Element {
    return (
      <div className="mt-10">
        <p className="text-white">Error</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-5 my-3">
        <p className="text-white">URL: {sourceUrl}</p>
        <button onClick={handleCopyUrl} className="hover:cursor-pointer">
          <FaRegCopy size={25} color="white" />
        </button>
      </div>

      {report && (
        <Document
          file={sourceUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="w-[700px]"
          loading={LoadingPdf}
          error={ErrorPdf}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={700}
              className="mb-10"
            />
          ))}
        </Document>
      )}
    </div>
  )
}
