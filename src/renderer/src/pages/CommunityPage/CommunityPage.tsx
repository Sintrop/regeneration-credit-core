import { useTranslation } from 'react-i18next'
import { MdGavel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { Abi } from 'viem'
import { useReadContracts } from 'wagmi'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { checkVacancies } from '@renderer/services/checkVacancies'
import { userAbi, userAddress } from '@renderer/services/contracts'

const TYPES = [1, 2, 3, 4, 5, 6, 7]
const TYPE_LABEL: Record<number, string> = {
  1: 'community.regenerators',
  2: 'community.inspectors',
  3: 'community.researchers',
  4: 'community.developers',
  5: 'community.contributors',
  6: 'community.activists',
  7: 'community.supporters'
}
/** Regenerators and supporters have no vacancy limit; the others grow with the regenerators. */
const UNLIMITED = [1, 7]

export function CommunityPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const contract = { address: userAddress as `0x${string}`, abi: userAbi as Abi }
  const { data, isLoading } = useReadContracts({
    contracts: [
      { ...contract, functionName: 'usersCount' },
      { ...contract, functionName: 'votersCount' },
      ...TYPES.map((type) => ({ ...contract, functionName: 'userTypesCount', args: [type] }))
    ]
  })
  const read = (index: number): number | undefined =>
    data?.[index]?.status === 'success' ? Number(data[index].result) : undefined
  const format = (value: number | undefined): string =>
    value === undefined ? '—' : Intl.NumberFormat(i18n.language).format(value)
  const producersCount = read(2) ?? 0

  return (
    <ScreenPage pageTitle={t('community.title')}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-5">
        <section className="p-6 rounded-2xl bg-card-primary border border-green-primary/20 flex gap-6 items-center">
          <div className="shrink-0">
            <p className="text-green-primary text-4xl font-bold">
              {isLoading ? '—' : format(read(0))}
            </p>
            <p className="text-gray-400 text-xs">{t('community.allUsers')}</p>
            <p className="mt-2 text-white font-semibold">{isLoading ? '—' : format(read(1))}</p>
            <p className="text-gray-400 text-xs">{t('community.voters')}</p>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{t('community.description')}</p>
        </section>

        <div className="grid grid-cols-3 gap-4">
          {TYPES.map((type, index) => {
            const count = read(index + 2)
            const vacancies =
              !UNLIMITED.includes(type) && count !== undefined
                ? checkVacancies({ producersCount, userType: type, userTypeCount: count }).ammount
                : undefined
            return (
              <button
                key={type}
                className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4 text-left hover:bg-card-primary/80 hover:cursor-pointer"
                onClick={() => navigate(`/users/${type}`)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-bold">{t(TYPE_LABEL[type])}</span>
                  <span className="text-green-primary text-lg">›</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="p-3 rounded-xl bg-card-secondary">
                    <span className="block text-white text-xl font-bold">{format(count)}</span>
                    <span className="text-gray-400 text-xs">{t('community.registered')}</span>
                  </span>
                  <span className="p-3 rounded-xl bg-card-secondary">
                    <span className="block text-white text-xl font-bold">
                      {UNLIMITED.includes(type) ? '∞' : format(vacancies)}
                    </span>
                    <span className="text-gray-400 text-xs">{t('community.vacancies')}</span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <button
          className="p-5 rounded-2xl bg-card-primary flex items-center gap-4 text-left hover:bg-card-primary/80 hover:cursor-pointer"
          onClick={() => navigate('/community/invalidations')}
        >
          <span className="w-11 h-11 shrink-0 rounded-xl bg-card-secondary flex items-center justify-center text-green-primary">
            <MdGavel size={22} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-white text-lg font-bold">{t('invalidation.title')}</span>
            <span className="block text-gray-400 text-sm">{t('invalidation.cardText')}</span>
          </span>
          <span className="text-green-primary text-lg">›</span>
        </button>
      </div>
    </ScreenPage>
  )
}
