import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'
import { useTranslation } from 'react-i18next'

interface Props {
  lastPublishedWork: number
  mainAction?: boolean
}
export function DeveloperActions({ lastPublishedWork, mainAction }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const developerContractAddressToUse =
    chainId === 250225 ? developerAddress : sequoiaDeveloperAddress
  const developerAbiToUse = chainId === 250225 ? developerAbi : sequoiaDeveloperAbi

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
