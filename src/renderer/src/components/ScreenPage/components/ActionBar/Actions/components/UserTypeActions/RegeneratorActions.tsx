import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress,
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function RegeneratorActions(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const regeneratorContractAddressToUse =
    chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress
  const regeneratorAbiToUse = chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi

  const inspectionContractAddressToUse =
    chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress
  const inspectionAbiToUse = chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('regeneratorActions')}</p>

      <div className="flex flex-wrap gap-5 mt-1">
        <ActionComponent
          actionName="withdraw"
          addressContract={regeneratorContractAddressToUse}
          abi={regeneratorAbiToUse as Abi}
        />

        <ActionComponent
          actionName="requestInspection"
          addressContract={inspectionContractAddressToUse}
          abi={inspectionAbiToUse as Abi}
        />
      </div>
    </div>
  )
}
