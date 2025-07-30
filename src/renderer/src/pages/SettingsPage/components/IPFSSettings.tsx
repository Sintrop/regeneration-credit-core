import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalAddUrl } from './ModalAddUrl'

export function IPFSSettings(): JSX.Element {
  const { t } = useTranslation()
  const { ipfsApiList, ipfsGatewayList, ipfsApiUrl, ipfsGatewayURL, addUrlToList, changeBaseUrl } =
    useSettingsContext()
  const [changeType, setChangeType] = useState<'api' | 'gateway'>('api')
  const [showAddUrl, setShowAddUrl] = useState<boolean>(false)

  function handleAddUrl(type: 'api' | 'gateway'): void {
    setChangeType(type)
    setShowAddUrl(true)
  }

  function addUrl(url: string): void {
    setShowAddUrl(false)

    addUrlToList({
      type: changeType === 'api' ? 'ipfsApi' : 'ipfsGateway',
      url
    })
  }

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-1 w-full">
      <p className="text-gray-300 text-sm">IPFS</p>

      <div className="flex flex-col gap-1 mt-5">
        <label className="text-white text-sm">API</label>
        <p className="text-sm text-gray-300">{t('descApiIpfs')}</p>
        <select
          value={ipfsApiUrl}
          className="w-full h-10 px-3 rounded-2xl bg-container-secondary text-white"
          onChange={(e) => changeBaseUrl({ type: 'ipfsApi', url: e.target.value })}
        >
          {ipfsApiList.map((url, index) => (
            <option key={index} value={url}>
              {url}
            </option>
          ))}
        </select>

        <div className="flex w-full justify-end mt-3">
          <button
            className="w-fit px-10 h-10 rounded-2xl bg-blue-primary font-semibold text-white hover:cursor-pointer"
            onClick={() => handleAddUrl('api')}
          >
            Add URL
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-5">
        <label className="text-white text-sm">Gateway</label>
        <p className="text-sm text-gray-300">{t('descGatewayIpfs')}</p>
        <select
          value={ipfsGatewayURL}
          className="w-full h-10 px-3 rounded-2xl bg-container-secondary text-white"
          onChange={(e) => changeBaseUrl({ type: 'ipfsGateway', url: e.target.value })}
        >
          {ipfsGatewayList.map((url, index) => (
            <option key={index} value={url}>
              {url}
            </option>
          ))}
        </select>

        <div className="flex w-full justify-end mt-3">
          <button
            className="w-fit px-10 h-10 rounded-2xl bg-blue-primary font-semibold text-white hover:cursor-pointer"
            onClick={() => handleAddUrl('gateway')}
          >
            Add URL
          </button>
        </div>
      </div>

      {showAddUrl && <ModalAddUrl close={() => setShowAddUrl(false)} add={addUrl} />}
    </div>
  )
}
