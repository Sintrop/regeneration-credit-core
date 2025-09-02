import {
  supporterAbi,
  supporterAddress,
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  rcAddress,
  sequoiaRcAddress,
  rcAbi,
  sequoiaRcAbi,
  invitationAddress,
  sequoiaInvitationAddress,
  sequoiaInvitationAbi,
  invitationAbi
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  mainAction?: boolean
}
export function SupporterActions({ mainAction }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const supporterContractAddressToUse =
    chainId === 250225 ? supporterAddress : sequoiaSupporterAddress
  const supporterAbiToUse = chainId === 250225 ? supporterAbi : sequoiaSupporterAbi

  const rcContractAddressToUse = chainId === 250225 ? rcAddress : sequoiaRcAddress
  const rcAbiToUse = chainId === 250225 ? rcAbi : sequoiaRcAbi

  const invitationContractAddressToUse =
    chainId === 250225 ? invitationAddress : sequoiaInvitationAddress
  const invitationAbiToUse = chainId === 250225 ? invitationAbi : sequoiaInvitationAbi

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
