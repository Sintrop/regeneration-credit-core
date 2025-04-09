/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { MethodItem } from '@renderer/pages/ContractPage/components/MethodItem/MethodItem'
import {
  rcAbi,
  sequoiaRcAbi,
  contractsSequoia,
  contractsMainnet,
  rcAddress,
  sequoiaRcAddress,
  invitationAbi,
  invitationAddress,
  sequoiaInvitationAbi,
  sequoiaInvitationAddress
} from '@renderer/services/contracts'

export function GeneralActions(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const rcContract =
    chainId === 250225
      ? contractsMainnet.find((contract) => contract.address === rcAddress)
      : contractsSequoia.find((contract) => contract.address === sequoiaRcAddress)
  const rcAbiToUse = chainId === 250225 ? rcAbi : sequoiaRcAbi
  const burnTokensMethod = rcAbiToUse.find((method) => method.name === 'burnTokens')

  const invitationContract =
    chainId === 250225
      ? contractsMainnet.find((contract) => contract.address === invitationAddress)
      : contractsSequoia.find((contract) => contract.address === sequoiaInvitationAddress)
  const invitationAbiToUse = chainId === 250225 ? invitationAbi : sequoiaInvitationAbi
  const invitationMethod = invitationAbiToUse.find((method) => method.name === 'invite')

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('generalActions')}</p>

      {rcContract &&
        <MethodItem
          contract={rcContract}
          //@ts-ignore
          method={burnTokensMethod}
        />
      }

      {invitationContract && (
        <MethodItem
          contract={invitationContract}
          //@ts-ignore
          method={invitationMethod}
        />
      )}
    </div>
  )
}
