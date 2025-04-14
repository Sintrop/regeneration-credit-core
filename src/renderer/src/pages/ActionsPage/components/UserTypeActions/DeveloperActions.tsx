import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function DeveloperActions(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const developerContractAddressToUse =
    chainId === 250225 ? developerAddress : sequoiaDeveloperAddress
  const developerAbiToUse = chainId === 250225 ? developerAbi : sequoiaDeveloperAbi

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('developerActions')}</p>

      <ActionComponent
        actionName="withdraw"
        addressContract={developerContractAddressToUse}
        abi={developerAbiToUse as Abi}
      />

      <ActionComponent
        actionName="addReport"
        addressContract={developerContractAddressToUse}
        abi={developerAbiToUse as Abi}
      />

      <ActionComponent
        actionName="addReportValidation"
        addressContract={developerContractAddressToUse}
        abi={developerAbiToUse as Abi}
      />
    </div>
  )
}
