import {
  supporterAbi,
  supporterAddress,
  rcAddress,
  rcAbi,
  invitationAddress,
  invitationAbi
} from '@renderer/services/contracts'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function SupporterActions(): JSX.Element {
  const supporterContractAddressToUse = supporterAddress
  const supporterAbiToUse = supporterAbi

  const rcContractAddressToUse = rcAddress
  const rcAbiToUse = rcAbi

  const invitationContractAddressToUse = invitationAddress
  const invitationAbiToUse = invitationAbi

  return (
    <div className="flex flex-col">
      <ActionComponent
        actionName="offsetting"
        addressContract={rcContractAddressToUse}
        abi={rcAbiToUse as Abi}
      />

      <ActionComponent
        actionName="declareReduction"
        addressContract={supporterContractAddressToUse}
        abi={supporterAbiToUse as Abi}
      />

      <ActionComponent
        actionName="updateProfilePhoto"
        addressContract={supporterContractAddressToUse}
        abi={supporterAbiToUse as Abi}
      />

      <ActionComponent
        actionName="invite"
        addressContract={invitationContractAddressToUse}
        abi={invitationAbiToUse as Abi}
        label="inviteSupporter"
        userTypeToInvite={7}
      />
    </div>
  )
}
