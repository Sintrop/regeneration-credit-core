import {
  supporterAbi,
  supporterAddress,
  sequoiaSupporterAbi,
  sequoiaSupporterAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function SupporterActions(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const supporterContractAddressToUse =
    chainId === 250225 ? supporterAddress : sequoiaSupporterAddress
  const supporterAbiToUse = chainId === 250225 ? supporterAbi : sequoiaSupporterAbi

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('supporterActions')}</p>

      <ActionComponent
        actionName="publish"
        addressContract={supporterContractAddressToUse}
        abi={supporterAbiToUse as Abi}
      />

      <ActionComponent
        actionName="offsetting"
        addressContract={supporterContractAddressToUse}
        abi={supporterAbiToUse as Abi}
      />

      <ActionComponent
        actionName="updateProfilePhoto"
        addressContract={supporterContractAddressToUse}
        abi={supporterAbiToUse as Abi}
      />
    </div>
  )
}
