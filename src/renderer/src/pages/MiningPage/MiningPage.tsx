import { useQuery } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getAddress, isAddress } from 'viem'
import { useAccount } from 'wagmi'

import { CopyRow } from '@renderer/components/CopyRow/CopyRow'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useCurrentBlock } from '@renderer/domain/Chain/useCases/useBlockNumber'
import { useUserContext } from '@renderer/hooks/useUserContext'
import {
  extractCommands,
  GO_SINTROP_RELEASES_URL,
  MINING_GUIDE_CONTRIBUTION_ID,
  NodeOs,
  nodeCommand,
  pickReleaseAsset,
  ReleaseAsset,
  SINTROP_TUTORIALS_URL
} from '@renderer/utils/goSintrop'

const OS_LIST: NodeOs[] = ['windows', 'ubuntu', 'macos']

/** Latest go-sintrop release, so the download link follows new versions without an app update. */
function useLatestRelease(): { tag: string; assets: ReleaseAsset[] } | undefined {
  const { data } = useQuery({
    queryKey: ['goSintropLatestRelease'],
    staleTime: 60 * 60 * 1000,
    queryFn: async () => {
      const response = await fetch(
        'https://api.github.com/repos/Sintrop/go-sintrop/releases/latest'
      )
      if (!response.ok) throw new Error(`GitHub ${response.status}`)
      const json = await response.json()
      return { tag: String(json.tag_name), assets: (json.assets ?? []) as ReleaseAsset[] }
    }
  })
  return data
}

function Step({
  index,
  title,
  children
}: {
  index: number
  title: string
  children: ReactNode
}): JSX.Element {
  return (
    <div className="flex gap-4">
      <span className="w-7 h-7 shrink-0 rounded-full bg-green-primary text-green-secondary text-sm font-bold flex items-center justify-center">
        {index}
      </span>
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="text-white font-semibold">{title}</p>
        {children}
      </div>
    </div>
  )
}

const Text = ({ children }: { children: ReactNode }): JSX.Element => (
  <p className="text-gray-300 text-sm">{children}</p>
)

export function MiningPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { userType } = useUserContext()
  const { blockNumber } = useCurrentBlock()
  const release = useLatestRelease()
  const [os, setOs] = useState<NodeOs>('windows')
  const [typed, setTyped] = useState('')
  const reward = (isConnected ? address : typed.trim()) ?? ''
  const validAddress = isAddress(reward) ? getAddress(reward) : ''
  const asset = release ? pickReleaseAsset(release.assets, os) : undefined
  const assetName =
    asset?.name ??
    `go-sintrop-${os === 'windows' ? 'win64' : os === 'macos' ? 'osx' : 'linux'}-${release?.tag ?? 'vX.Y.Z'}.zip`
  const button = 'h-10 px-4 rounded-xl text-sm font-semibold hover:cursor-pointer'

  return (
    <ScreenPage pageTitle={t('mining.title')}>
      <div className="max-w-[820px] mx-auto flex flex-col gap-4">
        <section className="p-5 rounded-2xl bg-green-primary/10 border border-green-primary/40 flex flex-col gap-2">
          <p className="text-white font-bold text-lg">{t('mining.introTitle')}</p>
          <Text>{t('mining.introText')}</Text>
          <Text>{t('mining.introSmallNetwork')}</Text>
        </section>

        <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-3">
          <p className="text-white font-bold text-lg">{t('mining.addressTitle')}</p>
          {isConnected ? (
            <>
              <Text>{t('mining.addressConnected')}</Text>
              <p className="text-white text-sm font-mono">{address}</p>
            </>
          ) : (
            <>
              <Text>{t('mining.addressPaste')}</Text>
              <input
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                placeholder="0x..."
                className="h-11 px-3 rounded-xl bg-card-secondary text-white outline-none focus:ring-1 focus:ring-green-primary"
              />
              {typed && !validAddress && (
                <p className="text-red-300 text-xs">{t('myTokens.invalidAddress')}</p>
              )}
            </>
          )}
        </section>

        <div className="flex p-1 rounded-xl bg-card-primary">
          {OS_LIST.map((item) => (
            <button
              key={item}
              onClick={() => setOs(item)}
              className={`flex-1 h-10 rounded-lg font-semibold hover:cursor-pointer ${os === item ? 'bg-green-primary text-green-secondary' : 'text-white'}`}
            >
              {t(`mining.os.${item}`)}
            </button>
          ))}
        </div>

        <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-6">
          <Step index={1} title={t('mining.downloadTitle')}>
            <Text>{t(`mining.download.${os}`, { file: assetName })}</Text>
            {os === 'macos' && <Text>{t('mining.macAppleSilicon')}</Text>}
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 flex flex-col gap-1">
              <p className="text-amber-300 text-sm font-semibold">
                {t('mining.unknownSourceTitle')}
              </p>
              <p className="text-gray-200 text-sm">{t('mining.unknownSourceText')}</p>
              <p className="text-gray-200 text-sm">{t(`mining.unknownSource.${os}`)}</p>
            </div>
            <a
              href={asset?.browser_download_url ?? GO_SINTROP_RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              className={`self-start flex items-center bg-green-primary text-green-secondary ${button}`}
            >
              {release
                ? t('mining.downloadButton', { version: release.tag })
                : t('mining.openReleases')}
            </a>
          </Step>
          <Step index={2} title={t('mining.extractTitle')}>
            <Text>{t(`mining.extract.${os}`)}</Text>
            {extractCommands(os, assetName).map((command) => (
              <CopyRow key={command} value={command} mono />
            ))}
          </Step>
          <Step index={3} title={t('mining.runTitle')}>
            <Text>{t(`mining.run.${os}`)}</Text>
            <CopyRow value={nodeCommand(os, validAddress)} mono />
            <Text>
              {validAddress ? t('mining.runAddressFilled') : t('mining.runAddressMissing')}
            </Text>
          </Step>
          <Step index={4} title={t('mining.syncTitle')}>
            <Text>{t('mining.syncText')}</Text>
            {blockNumber > 0 && (
              <p className="text-white text-sm">
                {t('mining.currentBlock', {
                  block: Intl.NumberFormat(i18n.language).format(blockNumber)
                })}
              </p>
            )}
          </Step>
          <Step index={5} title={t('mining.mineTitle')}>
            <Text>{t('mining.mineText')}</Text>
            <CopyRow value="miner.start()" mono />
            <Text>{t('mining.stopText')}</Text>
            <CopyRow value="miner.stop()" mono />
            <Text>{t('mining.exitText')}</Text>
          </Step>
          <Step index={6} title={t('mining.rewardTitle')}>
            <Text>{t('mining.rewardText')}</Text>
            <div className="flex flex-wrap gap-2">
              {isConnected && (
                <button
                  className={`border border-green-primary text-green-primary ${button}`}
                  onClick={() => navigate('/my-tokens')}
                >
                  {t('mining.openMyTokens')}
                </button>
              )}
              {isConnected && userType === 0 && (
                <button
                  className={`bg-green-primary text-green-secondary ${button}`}
                  onClick={() => navigate('/register')}
                >
                  {t('mining.registerSupporter')}
                </button>
              )}
            </div>
          </Step>
        </section>

        <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-2">
          <p className="text-white font-bold">{t('mining.tipsTitle')}</p>
          <Text>{t('mining.tipComputerOn')}</Text>
          <Text>{t('mining.tipRenewable')}</Text>
        </section>

        <section className="p-5 rounded-2xl bg-card-primary border border-green-primary/40 flex flex-col gap-3">
          <p className="text-white font-bold text-lg">{t('mining.guideTitle')}</p>
          <Text>{t('mining.guideText')}</Text>
          <div className="flex flex-wrap gap-2">
            <button
              className={`bg-green-primary text-green-secondary ${button}`}
              onClick={() =>
                navigate(`/resource-details/contribution/${MINING_GUIDE_CONTRIBUTION_ID}`)
              }
            >
              {t('mining.openGuide')}
            </button>
            <a
              href={SINTROP_TUTORIALS_URL}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center border border-green-primary text-green-primary ${button}`}
            >
              {t('mining.openTutorials')}
            </a>
          </div>
        </section>
      </div>
    </ScreenPage>
  )
}
