import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { useFeedUser } from '@renderer/hooks/useFeedUser'
import { useUserContext } from '@renderer/hooks/useUserContext'
import {
  InspectionStatus,
  InspectionSummary
} from '@renderer/services/inspections/inspectionsService'
import { AcceptInspection } from './InspectionsTab/AcceptInspection'

const STATUS_TEXT: Record<InspectionStatus, string> = {
  open: 'text-amber-300',
  accepted: 'text-blue-primary',
  realized: 'text-green-primary',
  invalidated: 'text-red-300',
  expired: 'text-orange-300'
}

type SortKey = 'id' | 'treesResult' | 'biodiversityResult' | 'regenerationScore' | 'inspectedAt'

export interface InspectionRow {
  inspection: InspectionSummary
  status: InspectionStatus
}

function UserCell({ address }: { address: string }): JSX.Element {
  const navigate = useNavigate()
  const user = useFeedUser(address)
  if (!address || /^0x0+$/.test(address)) return <span className="text-gray-500">—</span>
  return (
    <button
      className="max-w-[170px] truncate text-left text-white hover:underline hover:cursor-pointer"
      onClick={(event) => {
        event.stopPropagation()
        navigate(`/user-details/${address}`)
      }}
      title={address}
    >
      {user.name || `${address.slice(0, 6)}…${address.slice(-4)}`}
    </button>
  )
}

interface Props {
  rows: InspectionRow[]
  currentBlock: number
  acceptDelay: number
  onChanged: () => void
}

/** Every inspection in one sortable table; rows open the inspection. */
export function InspectionsTable({
  rows,
  currentBlock,
  acceptDelay,
  onChanged
}: Props): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { userType } = useUserContext()
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'id', desc: true })
  const [accepting, setAccepting] = useState<InspectionSummary | null>(null)
  const format = (value: number): string =>
    value ? Intl.NumberFormat(i18n.language).format(value) : '—'

  const sorted = [...rows].sort((a, b) => {
    const diff = a.inspection[sort.key] - b.inspection[sort.key]
    return sort.desc ? -diff : diff
  })

  function SortHeader({ column, label }: { column: SortKey; label: string }): JSX.Element {
    const active = sort.key === column
    return (
      <button
        className={`flex items-center gap-1 uppercase tracking-wide hover:cursor-pointer ${active ? 'text-green-primary' : ''}`}
        onClick={() => setSort({ key: column, desc: active ? !sort.desc : true })}
      >
        {label}
        {active && (sort.desc ? <MdArrowDownward size={14} /> : <MdArrowUpward size={14} />)}
      </button>
    )
  }

  const header = 'px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'
  const cell = 'px-3 py-3 text-sm'

  return (
    <div className="rounded-2xl bg-card-primary overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="border-b border-white/10">
          <tr>
            <th className={header}>
              <SortHeader column="id" label={t('inspections.columns.id')} />
            </th>
            <th className={header}>{t('inspections.columns.status')}</th>
            <th className={header}>{t('inspections.columns.regenerator')}</th>
            <th className={header}>{t('inspections.columns.inspector')}</th>
            <th className={header}>
              <SortHeader column="treesResult" label={t('inspections.columns.trees')} />
            </th>
            <th className={header}>
              <SortHeader
                column="biodiversityResult"
                label={t('inspections.columns.biodiversity')}
              />
            </th>
            <th className={header}>
              <SortHeader column="regenerationScore" label={t('inspections.columns.score')} />
            </th>
            <th className={header}>{t('inspections.columns.era')}</th>
            <th className={header}>
              <SortHeader column="inspectedAt" label={t('inspections.columns.inspectedAt')} />
            </th>
            <th className={header} />
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ inspection, status }) => {
            const acceptIn = inspection.createdAt + acceptDelay - currentBlock
            const canAccept =
              userType === 2 && (status === 'expired' || (status === 'open' && acceptIn <= 0))
            return (
              <tr
                key={inspection.id}
                className="border-b border-white/5 last:border-0 hover:bg-card-secondary/60 hover:cursor-pointer"
                onClick={() => navigate(`/resource-details/inspection/${inspection.id}`)}
              >
                <td className={`${cell} text-white font-semibold`}>#{inspection.id}</td>
                <td className={`${cell} font-semibold ${STATUS_TEXT[status]}`}>
                  {t(`inspections.status.${status}`)}
                </td>
                <td className={cell}>
                  <UserCell address={inspection.regenerator} />
                </td>
                <td className={cell}>
                  {status === 'open' ? (
                    <span className="text-gray-500">—</span>
                  ) : (
                    <UserCell address={inspection.inspector} />
                  )}
                </td>
                <td className={`${cell} text-white`}>{format(inspection.treesResult)}</td>
                <td className={`${cell} text-white`}>{format(inspection.biodiversityResult)}</td>
                <td className={`${cell} text-white`}>{format(inspection.regenerationScore)}</td>
                <td className={`${cell} text-gray-300`}>{inspection.inspectedAtEra || '—'}</td>
                <td className={`${cell} text-gray-300`}>{format(inspection.inspectedAt)}</td>
                <td className={`${cell} text-right`}>
                  {canAccept && (
                    <button
                      className="h-8 px-3 rounded-lg bg-green-primary text-green-secondary text-xs font-bold hover:cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation()
                        setAccepting(inspection)
                      }}
                    >
                      {t('inspections.acceptInspection')}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {accepting && (
        <AcceptInspection
          inspectionId={accepting.id}
          createdAt={accepting.createdAt}
          close={() => {
            setAccepting(null)
            onChanged()
          }}
        />
      )}
    </div>
  )
}
