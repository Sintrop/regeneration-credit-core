import { contributorAbi, contributorAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  lastPublishedWork: number
  mainAction?: boolean
}
export function ContributorActions({ lastPublishedWork, mainAction }: Props): JSX.Element {
  const { t } = useTranslation()

  const contributorContractAddressToUse = contributorAddress
  const contributorAbiToUse = contributorAbi

  if (mainAction) {
    return (
      <ActionComponent
        actionName="addContribution"
        addressContract={contributorContractAddressToUse}
        abi={contributorAbiToUse as Abi}
        lastPublishedWork={lastPublishedWork}
        mainAction
      />
    )
  }

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
        label={t('inviteContributor')}
        userTypeToInvite={5}
      />
    </div>
  )
}
