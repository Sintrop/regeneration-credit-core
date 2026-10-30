import { ActionComponent } from '@renderer/components/ScreenPage/components/ActionBar/Actions/components/ActionComponent/ActionComponent'
import { supporterAbi, supporterAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { Abi } from 'viem'

export function BurnTokensCalculator(): JSX.Element {
  const { t } = useTranslation()
  const abiToUse = supporterAbi
  const addressToUse = supporterAddress

  return (
    <div className="p-3 rounded-2xl flex flex-col gap-7 justify-between bg-container-primary w-[400px]">
      <div className="flex flex-col gap-2">
        <p className="text-white font-semibold">{t('impactCalculator.burnTokens')}</p>
        <p className="text-gray-200">{t('impactCalculator.descBurnTokens')}</p>
      </div>

      <ActionComponent
        actionName="burnTokens"
        abi={abiToUse as Abi}
        addressContract={addressToUse}
        mainAction
        hideNextLevel
      />
    </div>
  )
}
