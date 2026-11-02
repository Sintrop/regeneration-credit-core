import { developerAbi, developerAddress } from '@renderer/services/contracts'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  lastPublishedWork: number
}
export function DeveloperActions({ lastPublishedWork }: Props): JSX.Element {
  const developerContractAddressToUse = developerAddress
  const developerAbiToUse = developerAbi

  return (
    <div className="flex flex-col">
      <ActionComponent
        actionName="withdraw"
        addressContract={developerContractAddressToUse}
        abi={developerAbiToUse as Abi}
      />

      <ActionComponent
        actionName="addReport"
        addressContract={developerContractAddressToUse}
        abi={developerAbiToUse as Abi}
        lastPublishedWork={lastPublishedWork}
      />

      <ActionComponent
        actionName="addReportValidation"
        addressContract={developerContractAddressToUse}
        abi={developerAbiToUse as Abi}
      />

      <ActionComponent
        actionName="invite"
        addressContract={developerContractAddressToUse}
        abi={developerAbiToUse as Abi}
        label="inviteDeveloper"
        userTypeToInvite={4}
      />
    </div>
  )
}
