import { useUserContext } from '@renderer/hooks/useUserContext'
import { AcceptInspection } from '@renderer/pages/InspectionsPage/components/InspectionsTab/AcceptInspection'
import { InspectionProps } from '@renderer/types/inspection'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'

interface Props {
  inspection: InspectionProps
}

export function InspectionFeedContent({ inspection }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userType } = useUserContext()
  const status = parseInt(formatUnits(BigInt(inspection.status), 0))

  const [showAccept, setShowAccept] = useState(false)

  function handleGoToResourceDetails(): void {
    navigate(`/resource-details/inspection/${inspection.id}`)
  }

  function handleShowAccept(): void {
    setShowAccept(true)
  }

  function handleCloseAccept(): void {
    setShowAccept(false)
  }

  return (
    <div className="flex flex-col mt-2 pl-12">
      {status === 0 && (
        <div className="flex flex-col">
          <div className="w-full rounded-2xl flex items-center justify-between h-10 px-5 border-2 border-yellow-500">
            <p className="text-yellow-500">{t('feed.requestedAnInspection')}</p>
            <p className="text-yellow-500">{t('feed.open')}</p>
          </div>
          <p className="text-white mt-2">
            {t('feed.inspectionId')}: {formatUnits(BigInt(inspection.id), 0)}
          </p>
        </div>
      )}

      {status === 1 && (
        <div className="flex flex-col">
          <div className="w-full rounded-2xl flex items-center justify-between h-10 px-5 border-2 border-blue-500">
            <p className="text-blue-500">{t('feed.thisInspectionWasAccepted')}</p>
            <p className="text-blue-500">{t('feed.accepted')}</p>
          </div>

          <p className="text-white mt-2">
            {t('feed.inspectionId')}: {formatUnits(BigInt(inspection.id), 0)}
          </p>

          <p className="text-gray-300 text-sm mt-2">{t('feed.inspector')}:</p>
          <InspectorCard address={inspection.inspector} />
        </div>
      )}

      {status === 2 && (
        <div className="flex flex-col">
          <div className="w-full rounded-2xl flex items-center justify-between h-10 px-5 border-2 border-green-1">
            <p className="text-green-1">{t('feed.thisInspectionWasRealized')}</p>
            <p className="text-green-1">{t('feed.realized')}</p>
          </div>

          <p className="text-white mt-2">
            {t('feed.inspectionId')}: {formatUnits(BigInt(inspection.id), 0)}
          </p>

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

      {status === 3 && (
        <div className="flex flex-col">
          <div className="w-full rounded-2xl flex items-center justify-between h-10 px-5 border-2 border-red-500">
            <p className="text-red-500">{t('feed.thisInspectionWasInvalidated')}</p>
            <p className="text-red-500">{t('feed.invalidated')}</p>
          </div>

          <p className="text-white mt-2">
            {t('feed.inspectionId')}: {formatUnits(BigInt(inspection.id), 0)}
          </p>

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

      {userType === 2 && (
        <>
          {status === 0 && (
            <button
              className="text-green-500 underline hover:cursor-pointer mt-3"
              onClick={handleShowAccept}
            >
              {t('feed.acceptInspection')}
            </button>
          )}
        </>
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

      {showAccept && (
        <AcceptInspection
          inspectionId={inspection ? parseInt(formatUnits(BigInt(inspection?.id), 0)) : 0}
          createdAt={inspection ? parseInt(formatUnits(BigInt(inspection?.createdAt), 0)) : 0}
          close={handleCloseAccept}
        />
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
