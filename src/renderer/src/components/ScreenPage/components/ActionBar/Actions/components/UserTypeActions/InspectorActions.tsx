import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress,
  inspectorAbi,
  inspectorAddress,
  sequoiaInspectorAbi,
  sequoiaInspectorAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function InspectorActions(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const inspectorContractAddressToUse =
    chainId === 250225 ? inspectorAddress : sequoiaInspectorAddress
  const inspectorAbiToUse = chainId === 250225 ? inspectorAbi : sequoiaInspectorAbi

  const inspectionContractAddressToUse =
    chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress
  const inspectionAbiToUse = chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('inspectorActions')}</p>

      <div className="flex flex-wrap gap-5 mt-1">
        <ActionComponent
          actionName="withdraw"
          addressContract={inspectorContractAddressToUse}
          abi={inspectorAbiToUse as Abi}
        />

        <ActionComponent
          actionName="acceptInspection"
          addressContract={inspectionContractAddressToUse}
          abi={inspectionAbiToUse as Abi}
        />

        <ActionComponent
          actionName="realizeInspection"
          addressContract={inspectionContractAddressToUse}
          abi={inspectionAbiToUse as Abi}
        />
      </div>
    </div>
  )
}
