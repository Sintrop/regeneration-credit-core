import { useState } from 'react'
import { Loading } from '@renderer/components/Loading/Loading'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { InspectionProps } from '@renderer/types/inspection'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { pdfjs, Document, Page } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export function InspectionDetailsPage(): JSX.Element {
  const { inspectionId } = useParams()
  const { t } = useTranslation()
  const chainId = useChainId()
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

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    args: [inspectionId],
    functionName: 'getInspection'
  })

  const inspection = data as InspectionProps

  if (isLoading) {
    return (
      <ScreenPage pageTitle={`${t('inspection')} #${inspectionId}`}>
        <div className="w-full items-center overflow-hidden">
          <Loading />
        </div>
      </ScreenPage>
    )
  }

  return (
    <ScreenPage pageTitle={`${t('inspection')} #${inspectionId}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-white">{t('regenerator')}:</p>
          <UserAddressLink address={inspection.regenerator} />
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('inspector')}:</p>
          <UserAddressLink address={inspection.inspector} />
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('createdAt')}:</p>
          <p className="text-white">{inspection && formatUnits(BigInt(inspection.createdAt), 0)}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('acceptedAt')}:</p>
          <p className="text-white">
            {inspection && formatUnits(BigInt(inspection.acceptedAt), 0)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('inspectedAt')}:</p>
          <p className="text-white">
            {inspection && formatUnits(BigInt(inspection.inspectedAt), 0)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('inspectedAtEra')}:</p>
          <p className="text-white">
            {inspection && formatUnits(BigInt(inspection.inspectedAtEra), 0)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('validationsCount')}:</p>
          <p className="text-white">
            {inspection && formatUnits(BigInt(inspection.validationsCount), 0)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5 mt-2">
        <div className="w-40 h-24 rounded-2xl flex flex-col items-center justify-center bg-green-card">
          <p className="font-bold text-white text-2xl">
            {inspection && formatUnits(BigInt(inspection.treesResult), 0)}
          </p>
          <p className="text-gray-300 text-sm">{t('trees')}</p>
        </div>

        <div className="w-40 h-24 rounded-2xl flex flex-col items-center justify-center bg-green-card">
          <p className="font-bold text-white text-2xl">
            {inspection && formatUnits(BigInt(inspection.biodiversityResult), 0)}
          </p>
          <p className="text-gray-300 text-sm">{t('biodiversity')}</p>
        </div>

        <div className="w-40 h-24 rounded-2xl flex flex-col items-center justify-center bg-green-card">
          <p className="font-bold text-white text-2xl">
            {inspection && formatUnits(BigInt(inspection.regenerationScore), 0)}
          </p>
          <p className="text-gray-300 text-sm">{t('regenerationScore')}</p>
        </div>
      </div>

      <div className="flex flex-col mt-5">
        <p className="text-white text-2xl">{t('report')}</p>
        <p className="text-white mb-5">HASH: {inspection.report}</p>

        {inspection?.report && (
          <Document
            file={`https://ipfs.io/ipfs/${inspection?.report}`}
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
    </ScreenPage>
  )
}
