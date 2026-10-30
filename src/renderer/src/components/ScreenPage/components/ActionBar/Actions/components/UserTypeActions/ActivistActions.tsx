import { activistAbi, activistAddress } from '@renderer/services/contracts'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function ActivistActions(): JSX.Element {
  const activistContractAddressToUse = activistAddress
  const activistAbiToUse = activistAbi

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
