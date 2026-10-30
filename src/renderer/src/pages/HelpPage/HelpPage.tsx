import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAccount, useConnect } from 'wagmi'

import { CopyRow } from '@renderer/components/CopyRow/CopyRow'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { contractsMainnet, rcAddress } from '@renderer/services/contracts'
import {
  EthereumRequester,
  SINTROP_CHAIN_PARAMS,
  switchToSintrop
} from '@renderer/services/sintropChain'

const METAMASK_DOWNLOAD_URL = 'https://metamask.io/download/'
const METAMASK_MANUAL_URL =
  'https://ipfs.sintrop.com/ipfs/QmStSpPexGVQsLnkimNabGrDbhuAPcmUS5x61r7q5Uvg94'
const STEP_KEYS = ['wallet', 'network', 'connect', 'gas', 'register', 'earn', 'token'] as const
const FAQ_KEYS = [
  'whatIs',
  'howEarn',
  'buy',
  'invite',
  'sin',
  'eras',
  'withdraw',
  'inspection',
  'validation',
  'offset',
  'security',
  'rpc'
] as const

const NETWORK_ROWS = [
  { label: 'help.networkName', value: SINTROP_CHAIN_PARAMS.chainName },
  { label: 'help.rpcUrl', value: SINTROP_CHAIN_PARAMS.rpcUrls[0] },
  { label: 'help.chainId', value: String(parseInt(SINTROP_CHAIN_PARAMS.chainId, 16)) },
  { label: 'help.currencySymbol', value: SINTROP_CHAIN_PARAMS.nativeCurrency.symbol },
  { label: 'help.explorer', value: SINTROP_CHAIN_PARAMS.blockExplorerUrls[0] }
]
const TOKEN_ROWS = [
  { label: 'help.tokenAddress', value: rcAddress },
  { label: 'help.tokenSymbol', value: 'RC' },
  { label: 'help.tokenDecimals', value: '18' }
]

const primary =
  'h-10 px-4 rounded-xl bg-green-primary text-green-secondary text-sm font-bold flex items-center hover:cursor-pointer'
const secondary =
  'h-10 px-4 rounded-xl border border-green-primary text-green-primary text-sm font-semibold flex items-center hover:bg-green-primary/10 hover:cursor-pointer'

function Card({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: ReactNode
}): JSX.Element {
  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-3">
      <div>
        <p className="text-white font-bold text-lg">{title}</p>
        {description && <p className="text-gray-300 text-sm">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function FaqItem({ faqKey }: { faqKey: string }): JSX.Element {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl bg-card-secondary overflow-hidden">
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:cursor-pointer"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="flex-1 text-white font-semibold">{t(`help.faq.${faqKey}.q`)}</span>
        <span className="text-green-primary text-xl font-bold w-5 text-center">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <p className="px-4 pb-4 text-gray-300 text-sm whitespace-pre-line">
          {t(`help.faq.${faqKey}.a`)}
        </p>
      )}
    </div>
  )
}

export function HelpPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { isConnected, connector } = useAccount()
  const { connect, connectors } = useConnect()

  /** Adds and selects Sintrop in the connected wallet; connects first when needed. */
  async function addNetwork(): Promise<void> {
    if (!isConnected || !connector) {
      connect({ connector: connectors[0] })
      return
    }
    const provider = (await connector.getProvider()) as EthereumRequester
    if (await switchToSintrop(provider)) toast.success(t('help.networkAdded'))
  }
  const [showContracts, setShowContracts] = useState(false)
  const faqUrl = `https://regenerationcredit.org/${i18n.language.startsWith('pt') ? 'pt' : 'en'}/faq`

  return (
    <ScreenPage pageTitle={t('help.title')}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-4">
        <section className="p-5 rounded-2xl bg-green-primary/10 border border-green-primary/40">
          <p className="text-white font-bold text-lg">{t('help.welcomeTitle')}</p>
          <p className="text-gray-200 text-sm">{t('help.welcomeText')}</p>
        </section>

        <div className="grid grid-cols-[1fr_360px] gap-4 items-start">
          <div className="flex flex-col gap-4">
            <Card title={t('help.stepsTitle')}>
              <div className="flex flex-col gap-5">
                {STEP_KEYS.map((key, index) => (
                  <div key={key} className="flex gap-4">
                    <span className="w-7 h-7 shrink-0 rounded-full bg-green-primary text-green-secondary text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="text-white font-semibold">{t(`help.steps.${key}.title`)}</p>
                      <p className="text-gray-300 text-sm">{t(`help.steps.${key}.text`)}</p>
                      <div className="flex flex-wrap gap-2 mt-1 empty:hidden">
                        {key === 'wallet' && (
                          <>
                            <a
                              href={METAMASK_DOWNLOAD_URL}
                              target="_blank"
                              rel="noreferrer"
                              className={primary}
                            >
                              {t('help.downloadMetamask')}
                            </a>
                            <a
                              href={METAMASK_MANUAL_URL}
                              target="_blank"
                              rel="noreferrer"
                              className={secondary}
                            >
                              {t('help.metamaskManual')}
                            </a>
                          </>
                        )}
                        {key === 'network' && (
                          <button className={primary} onClick={addNetwork}>
                            {t('help.addNetwork')}
                          </button>
                        )}
                        {key === 'connect' &&
                          (isConnected ? (
                            <span className="text-green-primary text-sm font-semibold">
                              {t('help.connected')}
                            </span>
                          ) : (
                            <button
                              className={primary}
                              onClick={() => connect({ connector: connectors[0] })}
                            >
                              {t('actionBar.connectWallet')}
                            </button>
                          ))}
                        {key === 'gas' && (
                          <button className={primary} onClick={() => navigate('/mining')}>
                            {t('help.howToMine')}
                          </button>
                        )}
                        {key === 'register' && (
                          <button className={secondary} onClick={() => navigate('/register')}>
                            {t('actionBar.register')}
                          </button>
                        )}
                        {key === 'earn' && (
                          <button className={secondary} onClick={() => navigate('/market')}>
                            {t('help.openMarket')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title={t('help.faqTitle')}>
              {FAQ_KEYS.map((key) => (
                <FaqItem key={key} faqKey={key} />
              ))}
              <div className="flex items-center justify-between gap-3 pt-2">
                <p className="text-gray-400 text-sm">{t('help.moreInfo')}</p>
                <a href={faqUrl} target="_blank" rel="noreferrer" className={secondary}>
                  regenerationcredit.org
                </a>
              </div>
            </Card>
          </div>

          <aside className="flex flex-col gap-4">
            <Card title={t('help.networkTitle')} description={t('help.networkText')}>
              {NETWORK_ROWS.map((row) => (
                <CopyRow key={row.label} label={t(row.label)} value={row.value} />
              ))}
            </Card>
            <Card title={t('help.tokenTitle')} description={t('help.tokenText')}>
              {TOKEN_ROWS.map((row) => (
                <CopyRow key={row.label} label={t(row.label)} value={row.value} />
              ))}
            </Card>
            <Card title={t('help.contractsTitle')} description={t('help.contractsText')}>
              <button className={primary} onClick={() => navigate('/contracts')}>
                {t('contracts.openFromHelp')}
              </button>
              <button
                className="self-start text-green-primary text-sm font-semibold hover:cursor-pointer"
                onClick={() => setShowContracts((value) => !value)}
              >
                {showContracts
                  ? t('help.hideContracts')
                  : t('help.showContracts', { count: contractsMainnet.length })}
              </button>
              {showContracts &&
                contractsMainnet.map((contract) => (
                  <CopyRow key={contract.address} label={contract.name} value={contract.address} />
                ))}
            </Card>
          </aside>
        </div>
      </div>
    </ScreenPage>
  )
}
