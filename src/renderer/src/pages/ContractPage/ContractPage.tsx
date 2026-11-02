import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaExternalLinkAlt, FaRegCopy } from 'react-icons/fa'
import { MdSearch } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { contractsMainnet } from '@renderer/services/contracts'
import { MethodAbiProps } from '@renderer/types/contract'
import { MethodItem } from './components/MethodItem/MethodItem'

type Filter = 'all' | 'read' | 'write'
const EXPLORER = 'https://explorer.sintrop.com'

export function ContractPage(): JSX.Element {
  const { t } = useTranslation()
  const { address } = useParams()
  const contract = contractsMainnet.find((item) => item.address === address)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const methods = useMemo(() => {
    const all = ((contract?.abi ?? []) as MethodAbiProps[]).filter(
      (method) => method.type === 'function' && method.name
    )
    const text = query.trim().toLowerCase()
    return all
      .filter((method) => {
        const read = method.stateMutability === 'view' || method.stateMutability === 'pure'
        if (filter === 'read' && !read) return false
        if (filter === 'write' && read) return false
        return !text || method.name.toLowerCase().includes(text)
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [contract, query, filter])

  if (!contract) {
    return (
      <ScreenPage pageTitle={t('contracts.title')}>
        <p className="max-w-[1000px] mx-auto p-8 rounded-2xl bg-card-primary text-center text-gray-300">
          {t('contracts.notFound')}
        </p>
      </ScreenPage>
    )
  }

  function copy(): void {
    navigator.clipboard.writeText(contract!.address)
    toast.success(t('common.addressCopied'))
  }

  return (
    <ScreenPage pageTitle={contract.label ? t(contract.label) : contract.name}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-5">
        <section className="p-6 rounded-2xl bg-card-primary flex flex-col gap-3">
          <p className="text-gray-400 text-xs font-mono">{contract.name}</p>
          {contract.description && <p className="text-gray-200">{t(contract.description)}</p>}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card-secondary">
            <span className="flex-1 min-w-0 text-white text-sm font-mono truncate">
              {contract.address}
            </span>
            <button
              className="p-1 text-gray-300 hover:text-white hover:cursor-pointer"
              onClick={copy}
              title={t('common.copyAddress')}
            >
              <FaRegCopy size={15} />
            </button>
            <a
              href={`${EXPLORER}/address/${contract.address}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-green-primary text-sm font-semibold hover:underline"
            >
              {t('contracts.openExplorer')}
              <FaExternalLinkAlt size={11} />
            </a>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center gap-2 h-11 px-4 rounded-xl bg-card-primary">
            <MdSearch className="text-gray-400" size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('contracts.searchMethod')}
              className="flex-1 bg-transparent text-white outline-none"
            />
            <span className="text-gray-400 text-sm">{methods.length}</span>
          </label>
          <div className="flex p-1 rounded-xl bg-card-primary">
            {(['all', 'read', 'write'] as Filter[]).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`h-9 px-4 rounded-lg text-sm font-semibold hover:cursor-pointer ${
                  filter === item ? 'bg-green-primary text-green-secondary' : 'text-white'
                }`}
              >
                {t(`contracts.filter.${item}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {methods.map((method) => (
            <MethodItem
              key={`${method.name}-${method.inputs?.length ?? 0}`}
              method={method}
              contract={contract}
            />
          ))}
        </div>
      </div>
    </ScreenPage>
  )
}
