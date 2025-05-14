import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  lastPublishedWork: number
}
export function ContributorActions({ lastPublishedWork }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const contributorContractAddressToUse =
    chainId === 250225 ? contributorAddress : sequoiaContributorAddress
  const contributorAbiToUse = chainId === 250225 ? contributorAbi : sequoiaContributorAbi

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('contributorActions')}</p>

      <div className="flex flex-wrap gap-5 mt-1">
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
      </div>
    </div>
  )
}
