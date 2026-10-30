import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalAddUrl } from './ModalAddUrl'

export function RpcSettings(): JSX.Element {
  const { t } = useTranslation()
  const { rpcList, rpcUrl, addUrlToList, changeBaseUrl } = useSettingsContext()
  const [showAddUrl, setShowAddUrl] = useState<boolean>(false)

  function handleAddUrl(): void {
    setShowAddUrl(true)
  }

  function addUrl(url: string): void {
    setShowAddUrl(false)

    addUrlToList({
      type: 'rpc',
      url
    })
  }

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-1 w-full">
      <p className="text-gray-300 text-sm">RPC</p>

      <div className="flex flex-col gap-1 mt-5">
        <label className="text-white text-sm">Mainnet</label>
        <p className="text-sm text-gray-300">{t('descRpcMainnet')}</p>
        <select
          value={rpcUrl}
          className="w-full h-10 px-3 rounded-2xl bg-container-secondary text-white"
          onChange={(e) => changeBaseUrl({ type: 'rpc', url: e.target.value })}
        >
          {rpcList.map((url, index) => (
            <option key={index} value={url}>
              {url}
            </option>
          ))}
        </select>

        <div className="flex w-full justify-end mt-3">
          <button
            className="w-fit px-10 h-10 rounded-2xl bg-blue-primary font-semibold text-white hover:cursor-pointer"
            onClick={handleAddUrl}
          >
            Add URL
          </button>
        </div>
      </div>

      {showAddUrl && <ModalAddUrl close={() => setShowAddUrl(false)} add={addUrl} />}
    </div>
  )
}
