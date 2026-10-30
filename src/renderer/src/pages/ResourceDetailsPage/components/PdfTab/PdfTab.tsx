/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
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
  const container = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  // Pages follow the column width instead of overflowing it.
  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.min(Math.floor(entry.contentRect.width), 900))
    )
    observer.observe(element)
    return (): void => observer.disconnect()
  }, [])

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
        <p className="text-gray-300">{t('resourceDetails.loadingFile')}</p>
      </div>
    )
  }

  function ErrorPdf(): JSX.Element {
    return (
      <div className="mt-10">
        <p className="text-gray-300">{t('resourceDetails.fileError')}</p>
      </div>
    )
  }

  return (
    <div ref={container} className="flex flex-col min-w-0">
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-card-secondary">
        <p className="flex-1 min-w-0 text-gray-300 text-xs truncate">{sourceUrl}</p>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-green-primary text-sm font-semibold hover:underline"
        >
          {t('resourceDetails.openFile')}
        </a>
        <button
          onClick={handleCopyUrl}
          className="p-1 text-gray-300 hover:text-white hover:cursor-pointer"
          title={t('resourceDetails.copyUrl')}
        >
          <FaRegCopy size={16} />
        </button>
      </div>

      {report && width > 0 && (
        <Document
          file={sourceUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="max-w-full"
          loading={LoadingPdf}
          error={ErrorPdf}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={width}
              className="mb-6 rounded-xl overflow-hidden"
            />
          ))}
        </Document>
      )}
    </div>
  )
}
