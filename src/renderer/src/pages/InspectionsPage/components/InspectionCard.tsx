import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { useBlocksDuration } from '@renderer/hooks/useBlocksDuration'
import { useUserContext } from '@renderer/hooks/useUserContext'
import {
  InspectionStatus,
  InspectionSummary
} from '@renderer/services/inspections/inspectionsService'
import { AcceptInspection } from './InspectionsTab/AcceptInspection'

const STATUS_STYLE: Record<InspectionStatus, string> = {
  open: 'bg-amber-400/15 text-amber-300',
  accepted: 'bg-blue-primary/20 text-blue-primary',
  realized: 'bg-green-primary/20 text-green-primary',
  invalidated: 'bg-red-400/15 text-red-300',
  expired: 'bg-orange-400/15 text-orange-300'
}

function Stat({ label, value }: { label: string; value: number }): JSX.Element {
  return (
    <div className="flex-1 p-3 rounded-xl bg-card-secondary">
      <p className="text-white text-lg font-bold">{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  )
}

interface Props {
  inspection: InspectionSummary
  status: InspectionStatus
  currentBlock: number
  blocksToExpire: number
  acceptDelay: number
  onChanged: () => void
}

export function InspectionCard({
  inspection,
  status,
  currentBlock,
  blocksToExpire,
  acceptDelay,
  onChanged
}: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const formatBlocks = useBlocksDuration()
  const { userType } = useUserContext()
  const [accepting, setAccepting] = useState(false)

  const expireIn = inspection.acceptedAt + blocksToExpire - currentBlock
  const acceptIn = inspection.createdAt + acceptDelay - currentBlock
  const isInspector = userType === 2
  const acceptable = status === 'open' || status === 'expired'
  const hasResult = status === 'realized' || status === 'invalidated'

  return (
    <article className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <button
          className="text-white font-bold hover:underline hover:cursor-pointer"
          onClick={() => navigate(`/resource-details/inspection/${inspection.id}`)}
        >
          {t('inspections.inspection')} #{inspection.id}
        </button>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[status]}`}>
          {t(`inspections.status.${status}`)}
        </span>
      </div>

      {status === 'accepted' && (
        <p className="-mt-2 text-amber-300 text-xs">
          {t('inspections.expireIn', { duration: formatBlocks(expireIn) })}
        </p>
      )}
      {status === 'expired' && (
        <p className="-mt-2 text-orange-300 text-xs">
          {t('inspections.expiredAgo', { duration: formatBlocks(Math.abs(expireIn)) })}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <UserBadge address={inspection.regenerator} label={t('regenerator')} />
        {status !== 'open' && <UserBadge address={inspection.inspector} label={t('inspector')} />}
      </div>

      {hasResult && (
        <div className="flex gap-2">
          <Stat label={t('inspections.score')} value={inspection.regenerationScore} />
          <Stat label={t('trees')} value={inspection.treesResult} />
          <Stat label={t('biodiversity')} value={inspection.biodiversityResult} />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-card-secondary">
        {isInspector && acceptable ? (
          acceptIn > 0 && status === 'open' ? (
            <p className="text-amber-300 text-xs">
              {t('inspections.thisInspectionCanAcceptIn', { duration: formatBlocks(acceptIn) })}
            </p>
          ) : (
            <button
              className="h-9 px-4 rounded-xl bg-green-primary text-green-secondary text-sm font-bold hover:cursor-pointer"
              onClick={() => setAccepting(true)}
            >
              {t('inspections.acceptInspection')}
            </button>
          )
        ) : (
          <span />
        )}
        <button
          className="text-green-primary text-sm font-semibold hover:cursor-pointer"
          onClick={() => navigate(`/resource-details/inspection/${inspection.id}`)}
        >
          {t('resourcesList.open')} ›
        </button>
      </div>

      {accepting && (
        <AcceptInspection
          inspectionId={inspection.id}
          createdAt={inspection.createdAt}
          close={() => {
            setAccepting(false)
            onChanged()
          }}
        />
      )}
    </article>
  )
}
