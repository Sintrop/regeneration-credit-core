import { developerAbi, developerAddress } from '@renderer/services/contracts'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'
import { useTranslation } from 'react-i18next'

interface Props {
  lastPublishedWork: number
  mainAction?: boolean
}
export function DeveloperActions({ lastPublishedWork, mainAction }: Props): JSX.Element {
  const { t } = useTranslation()

  const developerContractAddressToUse = developerAddress
  const developerAbiToUse = developerAbi

  if (mainAction) {
    return (
      <ActionComponent
        actionName="addReport"
        addressContract={developerContractAddressToUse}
        abi={developerAbiToUse as Abi}
        lastPublishedWork={lastPublishedWork}
        mainAction
      />
    )
  }
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
        label={t('inviteDeveloper')}
        userTypeToInvite={4}
      />
    </div>
  )
}
