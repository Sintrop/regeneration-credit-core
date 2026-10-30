import { ReactNode } from 'react'

/** One "label: value" line of a data card. */
export function DataRow({
  label,
  value,
  danger
}: {
  label: ReactNode
  value: ReactNode
  danger?: boolean
}): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm shrink-0">{label}</span>
      <span
        className={`text-sm font-semibold text-right break-all ${danger ? 'text-red-300' : 'text-white'}`}
      >
        {value}
      </span>
    </div>
  )
}
