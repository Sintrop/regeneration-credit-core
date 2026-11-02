import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { useRpcHealth } from '@renderer/hooks/useRpcHealth'

/** Shown on every screen while the configured RPC fails its health check. */
export function RpcStatusBanner(): JSX.Element | null {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { unstable, recheck } = useRpcHealth()

  if (!unstable) return null

  return (
    <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex items-center gap-4">
      <div className="flex-1">
        <p className="text-amber-300 font-bold">{t('rpcStatus.title')}</p>
        <p className="text-gray-200 text-sm">{t('rpcStatus.description')}</p>
      </div>
      {pathname !== '/settings' && (
        <button
          className="h-10 px-4 rounded-xl bg-amber-400 text-green-secondary text-sm font-bold hover:cursor-pointer"
          onClick={() => navigate('/settings')}
        >
          {t('rpcStatus.changeRpc')}
        </button>
      )}
      <button
        className="h-10 px-4 rounded-xl border border-amber-400 text-amber-300 text-sm font-semibold hover:cursor-pointer"
        onClick={recheck}
      >
        {t('rpcStatus.retry')}
      </button>
    </div>
  )
}
