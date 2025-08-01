import { InspectionProps } from '@renderer/types/inspection'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'

interface Props {
  inspection: InspectionProps
}

export function InspectionFeedContent({ inspection }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const status = parseInt(formatUnits(BigInt(inspection.status), 0))

  function handleGoToResourceDetails(): void {
    navigate(`/resource-details/inspection/${inspection.id}`)
  }

  return (
    <div className="flex flex-col mt-2 pl-12">
      {status === 0 && (
        <div className="flex flex-col">
          <div className="w-full rounded-2xl flex items-center justify-between h-10 px-5 bg-[#ED8A28]/80">
            <p className="text-white">{t('feed.requestedAnInspection')}</p>
            <p className="text-yellow-500">{t('feed.open')}</p>
          </div>
          <p className="text-white mt-2">
            {t('feed.inspectionId')}: {formatUnits(BigInt(inspection.id), 0)}
          </p>
        </div>
      )}

      {status === 1 && (
        <div className="flex flex-col">
          <div className="w-full rounded-2xl flex items-center justify-between h-10 px-5 bg-[#044640]">
            <p className="text-white">{t('feed.thisInspectionWasAccepted')}</p>
            <p className="text-green-1">{t('feed.accepted')}</p>
          </div>

          <p className="text-gray-300 text-sm mt-2">{t('feed.inspector')}:</p>
          <InspectorCard address={inspection.inspector} />
        </div>
      )}

      {status === 2 && (
        <div className="flex flex-col">
          <div className="w-full rounded-2xl flex items-center justify-between h-10 px-5 bg-[#044640]">
            <p className="text-white">{t('feed.thisInspectionWasRealized')}</p>
            <p className="text-green-1">{t('feed.realized')}</p>
          </div>

          <p className="text-gray-300 text-sm mt-2">{t('feed.inspector')}:</p>
          <InspectorCard address={inspection.inspector} />

          <p className="text-gray-300 text-sm mt-2">{t('feed.result')}:</p>
          <div className="flex items-center gap-2">
            <p className="text-white">{t('feed.trees')}: </p>
            <p className="text-white">{formatUnits(BigInt(inspection.treesResult), 0)}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white">{t('feed.biodiversity')}: </p>
            <p className="text-white">{formatUnits(BigInt(inspection.biodiversityResult), 0)}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white">{t('feed.regenerationScore')}: </p>
            <p className="text-white">{formatUnits(BigInt(inspection.regenerationScore), 0)}</p>
          </div>
        </div>
      )}

      {status === 2 ? (
        <button
          className="text-green-500 underline hover:cursor-pointer mt-3"
          onClick={handleGoToResourceDetails}
        >
          {t('feed.seeInspection')}
        </button>
      ) : (
        <>
          {status === 3 && (
            <button
              className="text-green-500 underline hover:cursor-pointer mt-3"
              onClick={handleGoToResourceDetails}
            >
              {t('feed.seeInspection')}
            </button>
          )}
        </>
      )}
    </div>
  )
}

interface InspectorCardProps {
  address: string
}
function InspectorCard({ address }: InspectorCardProps): JSX.Element {
  const navigate = useNavigate()

  function handleGoToUserDetails(): void {
    navigate(`/user-details/${address}`)
  }

  return (
    <button
      className="flex gap-2 items-center hover:cursor-pointer"
      onClick={handleGoToUserDetails}
    >
      <Jazzicon className="w-7 h-7" address={address} />
      <p className="text-white text-sm truncate text-ellipsis max-w-[90%]">{address}</p>
    </button>
  )
}
