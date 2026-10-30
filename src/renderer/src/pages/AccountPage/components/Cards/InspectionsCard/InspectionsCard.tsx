import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { useCurrentBlock } from '@renderer/domain/Chain/useCases/useBlockNumber'
import { useProtocolRules } from '@renderer/hooks/useProtocolRules'
import { useRegeneratorInspections } from '@renderer/hooks/useRegeneratorInspections'
import {
  inspectionStatus,
  InspectionStatus
} from '@renderer/services/inspections/inspectionsService'

const STATUS_STYLE: Record<InspectionStatus, string> = {
  open: 'bg-amber-400/15 text-amber-300',
  accepted: 'bg-blue-primary/20 text-blue-primary',
  realized: 'bg-green-primary/20 text-green-primary',
  invalidated: 'bg-red-400/15 text-red-300',
  expired: 'bg-orange-400/15 text-orange-300'
}

/** Inspections of a regenerator with their results; the averages come from the realized ones. */
export function InspectionsCard({ address }: { address: string }): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { blockNumber } = useCurrentBlock()
  const { rules } = useProtocolRules()
  const { inspections, treesAverage, bioAverage, isLoading } = useRegeneratorInspections(address)
  const format = (value: number): string => Intl.NumberFormat(i18n.language).format(value)

  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-white font-bold">{t('account.inspections')}</p>
        {!isLoading && <span className="text-gray-400 text-sm">{inspections.length}</span>}
      </div>
      {isLoading ? (
        <div className="h-20 rounded-xl bg-card-secondary animate-pulse" />
      ) : inspections.length === 0 ? (
        <p className="text-gray-400 text-sm">{t('account.noInspections')}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-card-secondary">
              <p className="text-white font-bold">{format(treesAverage)}</p>
              <p className="text-gray-400 text-xs">{t('certificate.treesAverage')}</p>
            </div>
            <div className="p-3 rounded-xl bg-card-secondary">
              <p className="text-white font-bold">{format(bioAverage)}</p>
              <p className="text-gray-400 text-xs">{t('certificate.bioAverage')}</p>
            </div>
          </div>
          {inspections.map((inspection) => {
            const status = inspectionStatus(
              inspection,
              blockNumber,
              rules?.blocksToExpireAcceptedInspection ?? Infinity
            )
            const done = status === 'realized' || status === 'invalidated'
            return (
              <button
                key={inspection.id}
                className="p-4 rounded-xl bg-card-secondary flex items-center gap-4 text-left hover:ring-1 hover:ring-green-primary/50 hover:cursor-pointer"
                onClick={() => navigate(`/resource-details/inspection/${inspection.id}`)}
              >
                <span className="flex-1 min-w-0 flex flex-col gap-2">
                  <span className="flex items-center gap-2">
                    <span className="text-white font-semibold">#{inspection.id}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[status]}`}
                    >
                      {t(`inspections.status.${status}`)}
                    </span>
                  </span>
                  {status !== 'open' && (
                    <UserBadge address={inspection.inspector} label={t('inspector')} />
                  )}
                </span>
                {done && (
                  <span className="shrink-0 grid grid-cols-3 gap-3 text-right">
                    <span>
                      <span className="block text-white font-bold">
                        {format(inspection.treesResult)}
                      </span>
                      <span className="text-gray-400 text-[11px]">{t('trees')}</span>
                    </span>
                    <span>
                      <span className="block text-white font-bold">
                        {format(inspection.biodiversityResult)}
                      </span>
                      <span className="text-gray-400 text-[11px]">{t('biodiversity')}</span>
                    </span>
                    <span>
                      <span className="block text-white font-bold">
                        {inspection.regenerationScore}
                      </span>
                      <span className="text-gray-400 text-[11px]">{t('inspections.score')}</span>
                    </span>
                  </span>
                )}
              </button>
            )
          })}
        </>
      )}
    </section>
  )
}
