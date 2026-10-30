import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  lastPublishedWork: number
}
export function ResearcherActions({ lastPublishedWork }: Props): JSX.Element {
  const researcherContractAddressToUse = researcherAddress
  const researcherAbiToUse = researcherAbi

  return (
    <div className="flex flex-col">
      <ActionComponent
        actionName="withdraw"
        addressContract={researcherContractAddressToUse}
        abi={researcherAbiToUse as Abi}
      />

      <ActionComponent
        actionName="addResearch"
        addressContract={researcherContractAddressToUse}
        abi={researcherAbiToUse as Abi}
        lastPublishedWork={lastPublishedWork}
      />

      <ActionComponent
        actionName="addResearchValidation"
        addressContract={researcherContractAddressToUse}
        abi={researcherAbiToUse as Abi}
      />

      <ActionComponent
        actionName="addCalculatorItem"
        addressContract={researcherContractAddressToUse}
        abi={researcherAbiToUse as Abi}
      />

      <ActionComponent
        actionName="invite"
        addressContract={researcherContractAddressToUse}
        abi={researcherAbiToUse as Abi}
        label="inviteResearcher"
        userTypeToInvite={3}
      />
    </div>
  )
}
