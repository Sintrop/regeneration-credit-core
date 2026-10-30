import { activistAbi, activistAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  mainAction?: boolean
}
export function ActivistActions({ mainAction }: Props): JSX.Element {
  const { t } = useTranslation()

  const activistContractAddressToUse = activistAddress
  const activistAbiToUse = activistAbi

  if (mainAction) {
    return (
      <ActionComponent
        actionName="invite"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
        label={t('actions.inviteRegenerator')}
        userTypeToInvite={1}
        mainAction
      />
    )
  }

  return (
    <div className="flex flex-col">
      <ActionComponent
        actionName="withdraw"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
      />

      <ActionComponent
        actionName="invite"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
        label="inviteRegenerator"
        userTypeToInvite={1}
      />

      <ActionComponent
        actionName="invite"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
        label="inviteInspector"
        userTypeToInvite={2}
      />

      <ActionComponent
        actionName="invite"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
        label="inviteActivist"
        userTypeToInvite={6}
      />
    </div>
  )
}
