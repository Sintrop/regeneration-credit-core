import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  lastPublishedWork: number
  mainAction?: boolean
}
export function ResearcherActions({ lastPublishedWork, mainAction }: Props): JSX.Element {
  const { t } = useTranslation()

  const researcherContractAddressToUse = researcherAddress
  const researcherAbiToUse = researcherAbi

  if (mainAction) {
    return (
      <ActionComponent
        actionName="addResearch"
        addressContract={researcherContractAddressToUse}
        abi={researcherAbiToUse as Abi}
        lastPublishedWork={lastPublishedWork}
        mainAction
      />
    )
  }

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
        label={t('inviteResearcher')}
        userTypeToInvite={3}
      />
    </div>
  )
}
