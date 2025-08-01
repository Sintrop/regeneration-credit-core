import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface Props {
  report?: string
}
export function PdfTab({ report }: Props): JSX.Element {
  const { ipfsGatewayURL } = useSettingsContext()
  const [numPages, setNumPages] = useState<number>(0)

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
      <p className="text-white mb-5">HASH: {report}</p>
      {report && (
        <Document
          file={`${ipfsGatewayURL}/ipfs/${report}`}
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
