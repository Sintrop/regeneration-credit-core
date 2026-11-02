import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdArrowDownward, MdArrowUpward, MdSearch } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { useCommunityUsers } from '@renderer/hooks/useCommunityUsers'
import { MetricKey, USER_SOURCES } from '@renderer/services/community/usersService'
import { userTypeToName, UserTypeToNameType } from '@renderer/types/user'

type SortKey = 'id' | 'createdAt' | MetricKey

export function UsersPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const params = useParams()
  const userType = parseInt(params.userType as string) as UserTypeToNameType
  const { users, isLoading, isError, refetch } = useCommunityUsers(userType)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'id', desc: true })
  const metrics = USER_SOURCES[userType]?.metrics.map(([key]) => key) ?? []
  const format = (value: number | undefined): string =>
    value === undefined ? '—' : Intl.NumberFormat(i18n.language).format(value)

  const rows = useMemo(() => {
    const text = query.trim().toLowerCase()
    const filtered = text
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(text) || user.address.toLowerCase().includes(text)
        )
      : users
    const value = (user: (typeof users)[number]): number =>
      sort.key === 'id' || sort.key === 'createdAt' ? user[sort.key] : (user.metrics[sort.key] ?? 0)
    return [...filtered].sort((a, b) => (sort.desc ? value(b) - value(a) : value(a) - value(b)))
  }, [users, query, sort])

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

  const header = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'
  const cell = 'px-4 py-3 text-sm text-white'

  return (
    <ScreenPage pageTitle={t(`community.${userTypeToName[userType]}`)}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-4">
        <label className="flex items-center gap-2 h-11 px-4 rounded-xl bg-card-primary">
          <MdSearch className="text-gray-400" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('community.searchPlaceholder')}
            className="flex-1 bg-transparent text-white outline-none"
          />
          {!isLoading && <span className="text-gray-400 text-sm">{rows.length}</span>}
        </label>

        {isLoading ? (
          <div className="h-96 rounded-2xl bg-card-primary animate-pulse" />
        ) : isError || rows.length === 0 ? (
          <div className="p-8 rounded-2xl bg-card-primary text-center flex flex-col items-center gap-3">
            <p className="text-gray-300">
              {isError ? t('resourcesList.error') : t('community.noUsersFound')}
            </p>
            {isError && (
              <button
                className="text-green-primary font-semibold hover:cursor-pointer"
                onClick={() => refetch()}
              >
                {t('home.tryAgain')}
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-card-primary overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b border-white/10">
                <tr>
                  <th className={header}>
                    <SortHeader column="id" label="ID" />
                  </th>
                  <th className={header}>{t('community.name')}</th>
                  {metrics.map((key) => (
                    <th key={key} className={header}>
                      <SortHeader column={key} label={t(`community.metric.${key}`)} />
                    </th>
                  ))}
                  <th className={header}>
                    <SortHeader column="createdAt" label={t('community.registeredAtBlock')} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr
                    key={user.address}
                    className="border-b border-white/5 last:border-0 hover:bg-card-secondary/60 hover:cursor-pointer"
                    onClick={() => navigate(`/user-details/${user.address}`)}
                  >
                    <td className={`${cell} font-semibold`}>#{user.id}</td>
                    <td className={cell}>
                      <UserBadge address={user.address} />
                    </td>
                    {metrics.map((key) => (
                      <td key={key} className={cell}>
                        {key === 'area'
                          ? `${format(user.metrics[key])} m²`
                          : format(user.metrics[key])}
                      </td>
                    ))}
                    <td className={`${cell} text-gray-300`}>{format(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ScreenPage>
  )
}
