import { useChainId } from 'wagmi'
import { ActionComponent } from '@renderer/components/ScreenPage/components/ActionBar/Actions/components/ActionComponent/ActionComponent'
import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { Abi } from 'viem'

export function PublishCalculator(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const abiToUse = chainId === 250225 ? supporterAbi : sequoiaSupporterAbi
  const addressToUse = chainId === 250225 ? supporterAddress : sequoiaSupporterAddress

  return (
    <div className="p-3 rounded-2xl flex flex-col justify-between gap-7 bg-container-primary w-[400px]">
      <div className="flex flex-col gap-2">
        <p className="text-white font-semibold">{t('impactCalculator.publish')}</p>
        <p className="text-gray-200 mb-5">{t('impactCalculator.descPublish')}</p>
      </div>

      <ActionComponent
        actionName="publish"
        abi={abiToUse as Abi}
        addressContract={addressToUse}
        mainAction
        hideNextLevel
      />
    </div>
  )
}
