import {
  activistAbi,
  activistAddress,
  sequoiaActivistAbi,
  sequoiaActivistAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function ActivistActions(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const activistContractAddressToUse = chainId === 250225 ? activistAddress : sequoiaActivistAddress
  const activistAbiToUse = chainId === 250225 ? activistAbi : sequoiaActivistAbi

  return (
    <div className="flex flex-col">
      <ActionComponent
        actionName="withdraw"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
      />

      <ActionComponent
        actionName="invite"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
        label={t('inviteRegenerator')}
        userTypeToInvite={1}
      />

      <ActionComponent
        actionName="invite"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
        label={t('inviteInspector')}
        userTypeToInvite={2}
      />

      <ActionComponent
        actionName="invite"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
        label={t('inviteActivist')}
        userTypeToInvite={6}
      />
    </div>
  )
}
