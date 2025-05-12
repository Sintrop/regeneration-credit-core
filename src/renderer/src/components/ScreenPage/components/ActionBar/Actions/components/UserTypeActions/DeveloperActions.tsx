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

export function DeveloperActions(): JSX.Element {
  const { t } = useTranslation();
  const chainId = useChainId()

  const developerContractAddressToUse =
    chainId === 250225 ? developerAddress : sequoiaDeveloperAddress
  const developerAbiToUse = chainId === 250225 ? developerAbi : sequoiaDeveloperAbi

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('developerActions')}</p>

      <div className="flex flex-wrap gap-5 mt-1">
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
    </div>
  )
}
