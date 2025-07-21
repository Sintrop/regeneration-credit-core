import { useTranslation } from 'react-i18next'

export function IPFSSettings(): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-1 w-full">
      <p className="text-gray-300 text-sm">IPFS</p>
    </div>
  )
}