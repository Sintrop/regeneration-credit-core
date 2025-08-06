import { useTranslation } from 'react-i18next'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { CertificatesCard } from '@renderer/components/CertificatesCard/CertificatesCard'
import { useAccount } from 'wagmi'
import { BurnTokensCalculator } from './components/BurnTokensCalculator'
import { PublishCalculator } from './components/PublishCalculator'
import { OffsetCalculator } from './components/OffsetCalculator/OffsetCalculator'

export function ImpactCalculator(): JSX.Element {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()

  return (
    <ScreenPage pageTitle={t('impactCalculator.title')}>
      <CertificatesCard address={isConnected ? (address as string) : ''} userType={7} />

      <div className="flex gap-10 mt-10">
        <BurnTokensCalculator />
        <PublishCalculator />
      </div>

      <OffsetCalculator />
    </ScreenPage>
  )
}
