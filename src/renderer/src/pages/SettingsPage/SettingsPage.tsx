import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAccount, useDisconnect } from 'wagmi'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useRpcHealth } from '@renderer/hooks/useRpcHealth'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { isMapboxToken } from '@renderer/utils/mapbox'

const LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
]

const input =
  'w-full h-11 px-3 rounded-xl bg-card-secondary text-white outline-none focus:ring-1 focus:ring-green-primary'

function Section({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: ReactNode
}): JSX.Element {
  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
      <div>
        <p className="text-white text-lg font-bold">{title}</p>
        {description && <p className="text-gray-300 text-sm">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function LanguageSection(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { handleChangeLanguage } = useSettingsContext()
  const current = i18n.language.slice(0, 2)
  return (
    <Section title={t('settingsPage.language')}>
      <div className="grid grid-cols-3 gap-2">
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => handleChangeLanguage(language.code)}
            className={`h-11 rounded-xl font-semibold hover:cursor-pointer ${
              current === language.code
                ? 'bg-green-primary text-green-secondary'
                : 'bg-card-secondary text-white'
            }`}
          >
            {language.label}
          </button>
        ))}
      </div>
    </Section>
  )
}

function RpcSection(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { rpcUrl, rpcList, defaultRpc, changeRpc, changeBaseUrl, resetRpc } = useSettingsContext()
  const { health, recheck } = useRpcHealth()
  const [custom, setCustom] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const others = rpcList.filter((url) => url !== rpcUrl)

  async function save(): Promise<void> {
    setSaving(true)
    setError(null)
    const result = await changeRpc(custom)
    setSaving(false)
    if (result.ok) {
      setCustom('')
      toast.success(t('settingsPage.rpcSaved'))
    } else {
      setError(t(`settingsPage.rpcError.${result.error}`))
    }
  }

  return (
    <Section title={t('settingsPage.network')} description={t('settingsPage.rpcDescription')}>
      <div className="p-4 rounded-xl bg-card-secondary flex flex-col gap-1">
        <p className="text-gray-400 text-xs">
          {t('settingsPage.currentRpc')}
          {rpcUrl === defaultRpc ? ` · ${t('settingsPage.default')}` : ''}
        </p>
        <p className="text-white truncate">{rpcUrl}</p>
        {!health ? (
          <p className="text-gray-400 text-xs">{t('settingsPage.checking')}</p>
        ) : health.ok ? (
          <p className="text-green-primary text-xs">
            {t('settingsPage.rpcOnline', {
              ms: health.latencyMs,
              block: Intl.NumberFormat(i18n.language).format(health.blockNumber ?? 0)
            })}
          </p>
        ) : (
          <p className="text-red-300 text-xs">{t(`settingsPage.rpcError.${health.error}`)}</p>
        )}
        <button
          className="self-start mt-1 text-green-primary text-xs font-semibold hover:cursor-pointer"
          onClick={recheck}
        >
          {t('settingsPage.testAgain')}
        </button>
      </div>

      {others.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-gray-300 text-sm">{t('settingsPage.savedRpcs')}</p>
          {others.map((url) => (
            <button
              key={url}
              className="h-10 px-3 rounded-xl bg-card-secondary text-left text-sm text-white truncate hover:ring-1 hover:ring-green-primary hover:cursor-pointer"
              onClick={() => changeBaseUrl({ type: 'rpc', url })}
            >
              {url}
            </button>
          ))}
        </div>
      )}

      <label className="flex flex-col gap-2">
        <span className="text-gray-300 text-sm">{t('settingsPage.customRpc')}</span>
        <input
          value={custom}
          onChange={(event) => {
            setCustom(event.target.value)
            setError(null)
          }}
          placeholder="https://"
          className={input}
        />
        {error && <span className="text-red-300 text-sm">{error}</span>}
      </label>
      <div className="flex gap-3">
        <button
          className="h-11 px-5 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!custom.trim() || saving}
          onClick={save}
        >
          {saving ? t('settingsPage.checking') : t('settingsPage.testAndSave')}
        </button>
        {rpcUrl !== defaultRpc && (
          <button
            className="h-11 px-5 rounded-xl border border-green-primary text-green-primary font-semibold hover:bg-green-primary/10 hover:cursor-pointer"
            onClick={() => {
              resetRpc()
              toast.success(t('settingsPage.rpcRestored'))
            }}
          >
            {t('settingsPage.restoreDefault', { rpc: defaultRpc })}
          </button>
        )}
      </div>
      <p className="text-gray-500 text-xs">{t('settingsPage.chainNote')}</p>
    </Section>
  )
}

function UrlPicker({
  label,
  description,
  value,
  options,
  onChange
}: {
  label: string
  description: string
  value: string
  options: string[]
  onChange: (url: string) => void
}): JSX.Element {
  const { t } = useTranslation()
  const [custom, setCustom] = useState('')
  const valid = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(custom.trim())
  return (
    <div className="flex flex-col gap-2">
      <p className="text-white font-semibold">{label}</p>
      <p className="-mt-1 text-gray-400 text-xs">{description}</p>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={input}>
        {[...new Set([value, ...options])].map((url) => (
          <option key={url} value={url}>
            {url}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          placeholder="https://"
          className={input}
        />
        <button
          className="h-11 px-4 shrink-0 rounded-xl border border-green-primary text-green-primary text-sm font-semibold hover:bg-green-primary/10 hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!valid}
          onClick={() => {
            onChange(custom.trim().replace(/\/+$/, ''))
            setCustom('')
          }}
        >
          {t('settingsPage.add')}
        </button>
      </div>
    </div>
  )
}

function IpfsSection(): JSX.Element {
  const { t } = useTranslation()
  const { ipfsApiUrl, ipfsApiList, ipfsGatewayURL, ipfsGatewayList, addUrlToList } =
    useSettingsContext()
  return (
    <Section title="IPFS" description={t('settingsPage.ipfsDescription')}>
      <UrlPicker
        label="API"
        description={t('descApiIpfs')}
        value={ipfsApiUrl}
        options={ipfsApiList}
        onChange={(url) => addUrlToList({ type: 'ipfsApi', url })}
      />
      <UrlPicker
        label="Gateway"
        description={t('descGatewayIpfs')}
        value={ipfsGatewayURL}
        options={ipfsGatewayList}
        onChange={(url) => addUrlToList({ type: 'ipfsGateway', url })}
      />
    </Section>
  )
}

function MapboxSection(): JSX.Element {
  const { t } = useTranslation()
  const { mapboxToken, defaultMapboxToken, changeMapboxToken } = useSettingsContext()
  const [value, setValue] = useState('')
  const custom = mapboxToken !== defaultMapboxToken
  const configured = isMapboxToken(mapboxToken)
  const masked = configured ? `${mapboxToken.slice(0, 8)}…${mapboxToken.slice(-4)}` : '—'

  return (
    <Section title="Mapbox" description={t('settingsPage.mapboxDescription')}>
      <div className="p-4 rounded-xl bg-card-secondary flex flex-col gap-1">
        <p className="text-gray-400 text-xs">
          {t('settingsPage.mapboxCurrent')}
          {configured && !custom ? ` · ${t('settingsPage.default')}` : ''}
        </p>
        <p className="text-white font-mono text-sm">{masked}</p>
        {!configured && <p className="text-amber-300 text-xs">{t('settingsPage.mapboxMissing')}</p>}
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-gray-300 text-sm">{t('settingsPage.mapboxOwn')}</span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="pk.…"
          className={input}
        />
      </label>
      <div className="flex gap-3">
        <button
          className="h-11 px-5 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!/^pk\.[\w.-]{20,}$/.test(value.trim())}
          onClick={() => {
            changeMapboxToken(value)
            setValue('')
            toast.success(t('settingsPage.mapboxSaved'))
          }}
        >
          {t('settingsPage.mapboxUse')}
        </button>
        {custom && (
          <button
            className="h-11 px-5 rounded-xl border border-green-primary text-green-primary font-semibold hover:bg-green-primary/10 hover:cursor-pointer"
            onClick={() => {
              changeMapboxToken('')
              toast.success(t('settingsPage.mapboxRestored'))
            }}
          >
            {t('settingsPage.mapboxRestore')}
          </button>
        )}
      </div>
      <p className="text-gray-500 text-xs">{t('settingsPage.mapboxNote')}</p>
    </Section>
  )
}

function LinkRow({
  title,
  text,
  path
}: {
  title: string
  text: string
  path: string
}): JSX.Element {
  const navigate = useNavigate()
  return (
    <button
      className="w-full p-5 rounded-2xl bg-card-primary flex items-center justify-between gap-4 text-left hover:bg-card-primary/80 hover:cursor-pointer"
      onClick={() => navigate(path)}
    >
      <span>
        <span className="block text-white font-bold">{title}</span>
        <span className="text-gray-300 text-sm">{text}</span>
      </span>
      <span className="text-green-primary text-xl">›</span>
    </button>
  )
}

export function SettingsPage(): JSX.Element {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <ScreenPage pageTitle={t('settings')}>
      <div className="max-w-[760px] mx-auto flex flex-col gap-4">
        <LanguageSection />
        <RpcSection />
        <IpfsSection />
        <MapboxSection />
        {isConnected && (
          <Section title={t('settingsPage.wallet')}>
            <div className="flex items-center justify-between gap-4">
              <span className="min-w-0">
                <span className="block text-gray-400 text-xs">
                  {t('settingsPage.connectedWallet')}
                </span>
                <span className="text-white text-sm truncate block">{address}</span>
              </span>
              <button
                className="h-10 px-4 shrink-0 rounded-xl border border-red-400/60 text-red-300 text-sm font-semibold hover:bg-red-400/10 hover:cursor-pointer"
                onClick={() => disconnect()}
              >
                {t('settingsPage.disconnect')}
              </button>
            </div>
          </Section>
        )}
        <LinkRow
          title={t('contracts.settingsTitle')}
          text={t('contracts.settingsText')}
          path="/contracts"
        />
        <LinkRow
          title={t('settingsPage.ipfsToolTitle')}
          text={t('settingsPage.ipfsToolText')}
          path="/ipfs"
        />
      </div>
    </ScreenPage>
  )
}
