import { Loading } from '@renderer/components/Loading/Loading'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { InspectionProps } from '@renderer/types/inspection'
import { useTranslation } from 'react-i18next'
import { Img } from 'react-image'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  id: number
  setValidationsCount: (count: number) => void
  setReport: (report: string) => void
}
export function InspectionData({ id, setReport, setValidationsCount }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    args: [id],
    functionName: 'getInspection'
  })

  const inspection = data as InspectionProps

  if (inspection) {
    setReport(inspection.report)
    setValidationsCount(parseInt(formatUnits(BigInt(inspection.validationsCount), 0)))
    console.log(inspection)
  }

  if (isLoading) {
    return (
      <div>
        <div className="w-full items-center overflow-hidden">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-10">
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
            <p className="text-white">{t('proofPhoto')}:</p>
            <p className="text-white">{inspection && inspection.proofPhoto}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-white">{t('createdAt')}:</p>
            <p className="text-white">
              {inspection && formatUnits(BigInt(inspection.createdAt), 0)}
            </p>
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

        <Img
          src={`https://ipfs.io/ipfs/${inspection.proofPhoto}`}
          className="w-[200px] h-[200px] rounded-2xl object-cover"
        />
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
    </div>
  )
}
