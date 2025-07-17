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
import { BiChevronRight } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  inspectionId: number
}

export function InspectionCardItem({ inspectionId }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    functionName: 'getInspection',
    args: [inspectionId]
  })

  function handleGoToResourceDetails(): void {
    navigate(`/resource-details/inspection/${inspectionId}`)
  }

  const inspection = data as InspectionProps

  return (
    <button
      className="w-full flex items-center justify-between border-b pb-3 hover:cursor-pointer"
      onClick={handleGoToResourceDetails}
    >
      {isLoading ? (
        <div className="overflow-hidden">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {inspection && (
            <>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-white">ID:</p>
                  <p className="text-white font-semibold">{inspectionId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-white">{t('regenerator')}:</p>
                  <UserAddressLink address={inspection?.regenerator} />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-white">{t('inspector')}:</p>
                  <UserAddressLink address={inspection?.inspector} />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-white">{t('era')}:</p>
                  <p className="text-white font-semibold">
                    {formatUnits(BigInt(inspection.inspectedAtEra), 0)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-white">{t('inspectedAt')}:</p>
                  <p className="text-white font-semibold">
                    {formatUnits(BigInt(inspection.inspectedAt), 0)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-24 h-16 rounded-2xl flex flex-col items-center justify-center bg-container-primary">
                  <p className="font-bold text-white text-xl">
                    {inspection && formatUnits(BigInt(inspection.treesResult), 0)}
                  </p>
                  <p className="text-gray-300 text-xs">{t('trees')}</p>
                </div>

                <div className="w-24 h-16 rounded-2xl flex flex-col items-center justify-center bg-container-primary">
                  <p className="font-bold text-white text-xl">
                    {inspection && formatUnits(BigInt(inspection.biodiversityResult), 0)}
                  </p>
                  <p className="text-gray-300 text-xs">{t('biodiversity')}</p>
                </div>

                <div className="w-24 h-16 rounded-2xl flex flex-col items-center justify-center bg-container-primary">
                  <p className="font-bold text-white text-xl">
                    {inspection && formatUnits(BigInt(inspection.regenerationScore), 0)}
                  </p>
                  <p className="text-gray-300 text-xs">{t('regenerationScore')}</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <BiChevronRight size={35} color="white" />
    </button>
  )
}
