import { useTranslation } from 'react-i18next'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { CertificatesCard } from '@renderer/components/CertificatesCard/CertificatesCard'
import { useAccount } from 'wagmi'
import { BurnTokensCalculator } from './components/BurnTokensCalculator'
import { OffsetCalculator } from './components/OffsetCalculator/OffsetCalculator'

export function ImpactCalculator(): JSX.Element {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()

  return (
    <ScreenPage pageTitle={t('impactCalculator.title')}>
      <div className="flex gap-10 mt-10">
        <div className="flex w-[500px]">
          <CertificatesCard address={isConnected ? (address as string) : ''} userType={7} />
        </div>

        <BurnTokensCalculator />
      </div>

      <OffsetCalculator />
    </ScreenPage>
  )
}
