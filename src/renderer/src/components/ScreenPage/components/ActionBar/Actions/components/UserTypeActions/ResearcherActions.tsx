import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  lastPublishedWork: number
}
export function ResearcherActions({ lastPublishedWork }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const researcherContractAddressToUse =
    chainId === 250225 ? researcherAddress : sequoiaResearcherAddress
  const researcherAbiToUse = chainId === 250225 ? researcherAbi : sequoiaResearcherAbi

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('researcherActions')}</p>

      <div className="flex flex-wrap gap-5 mt-1">
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
    </div>
  )
}
