import { useState } from 'react'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { pdfjs, Document, Page } from 'react-pdf'
import { useParams } from 'react-router-dom'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export function PdfPage(): JSX.Element {
  const { ipfsGatewayURL } = useSettingsContext()
  const params = useParams()
  const [numPages, setNumPages] = useState<number>(0)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  function Loading(): JSX.Element {
    return (
      <div className="flex-1 items-center justify-center">
        <p className="text-white">loading file...</p>
      </div>
    )
  }

  function Error(): JSX.Element {
    return (
      <div className="mt-10">
        <p className="text-white">Error</p>
      </div>
    )
  }

  return (
    <ScreenPage pageTitle="PDF View">
      <p className="text-white mb-5">HASH: {params?.hash}</p>

      <Document
        file={`${ipfsGatewayURL}/ipfs/${params?.hash}`}
        onLoadSuccess={onDocumentLoadSuccess}
        className="w-[700px]"
        loading={Loading}
        error={Error}
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
    </ScreenPage>
  )
}
