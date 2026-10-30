import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdSearch } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { contractsMainnet } from '@renderer/services/contracts'
import { ContractListProps } from '@renderer/types/contract'

type Group = 'token' | 'users' | 'pools' | 'system'
const GROUPS: Group[] = ['token', 'users', 'pools', 'system']
const USER_RULES = [
  'RegeneratorRules',
  'InspectorRules',
  'ResearcherRules',
  'DeveloperRules',
  'ContributorRules',
  'ActivistRules',
  'SupporterRules'
]

function groupOf(contract: ContractListProps): Group {
  if (contract.name.startsWith('RegenerationCredit') || contract.name === 'RCMarket') return 'token'
  if (contract.name.endsWith('Pool')) return 'pools'
  if (USER_RULES.includes(contract.name)) return 'users'
  return 'system'
}

export function ContractsPage(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const text = query.trim().toLowerCase()
  const visible = contractsMainnet.filter(
    (contract) =>
      !text ||
      contract.name.toLowerCase().includes(text) ||
      contract.address.toLowerCase().includes(text) ||
      t(contract.label ?? '')
        .toLowerCase()
        .includes(text)
  )

  return (
    <ScreenPage pageTitle={t('contracts.title')}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-5">
        <p className="text-gray-300 text-sm">{t('contracts.intro')}</p>
        <label className="flex items-center gap-2 h-11 px-4 rounded-xl bg-card-primary">
          <MdSearch className="text-gray-400" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('contracts.searchPlaceholder')}
            className="flex-1 bg-transparent text-white outline-none"
          />
        </label>
        {GROUPS.map((group) => {
          const items = visible.filter((contract) => groupOf(contract) === group)
          if (items.length === 0) return null
          return (
            <section key={group} className="flex flex-col gap-3">
              <p className="text-white text-lg font-bold">{t(`contracts.group.${group}`)}</p>
              <div className="grid grid-cols-2 gap-3">
                {items.map((contract) => (
                  <button
                    key={contract.address}
                    className="p-5 rounded-2xl bg-card-primary flex flex-col gap-2 text-left hover:bg-card-primary/80 hover:cursor-pointer"
                    onClick={() => navigate(`/contracts/${contract.address}`)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-white font-bold">
                        {contract.label ? t(contract.label) : contract.name}
                      </span>
                      <span className="text-green-primary">›</span>
                    </span>
                    <span className="text-gray-400 text-xs font-mono">
                      {contract.name} · {contract.address.slice(0, 10)}…{contract.address.slice(-6)}
                    </span>
                    {contract.description && (
                      <span className="text-gray-300 text-sm line-clamp-2">
                        {t(contract.description)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </ScreenPage>
  )
}
