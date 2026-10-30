import { contributorAbi, contributorAddress } from '@renderer/services/contracts'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  lastPublishedWork: number
}
export function ContributorActions({ lastPublishedWork }: Props): JSX.Element {
  const contributorContractAddressToUse = contributorAddress
  const contributorAbiToUse = contributorAbi

  return (
    <div className="flex flex-col">
      <ActionComponent
        actionName="withdraw"
        addressContract={contributorContractAddressToUse}
        abi={contributorAbiToUse as Abi}
      />

      <ActionComponent
        actionName="addContribution"
        addressContract={contributorContractAddressToUse}
        abi={contributorAbiToUse as Abi}
        lastPublishedWork={lastPublishedWork}
      />

      <ActionComponent
        actionName="invite"
        addressContract={contributorContractAddressToUse}
        abi={contributorAbiToUse as Abi}
        label="inviteContributor"
        userTypeToInvite={5}
      />
    </div>
  )
}
