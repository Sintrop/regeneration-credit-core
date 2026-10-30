import {
  supporterAbi,
  supporterAddress,
  rcAddress,
  rcAbi,
  invitationAddress,
  invitationAbi
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  mainAction?: boolean
}
export function SupporterActions({ mainAction }: Props): JSX.Element {
  const { t } = useTranslation()

  const supporterContractAddressToUse = supporterAddress
  const supporterAbiToUse = supporterAbi

  const rcContractAddressToUse = rcAddress
  const rcAbiToUse = rcAbi

  const invitationContractAddressToUse = invitationAddress
  const invitationAbiToUse = invitationAbi

  if (mainAction) {
    return (
      <ActionComponent
        actionName="offsetting"
        addressContract={rcContractAddressToUse}
        abi={rcAbiToUse as Abi}
        mainAction
      />
    )
  }

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
        label={t('inviteSupporter')}
        userTypeToInvite={7}
      />
    </div>
  )
}
