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
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

interface Props {
  mainAction?: boolean
}
export function InspectorActions({ mainAction }: Props): JSX.Element {
  const chainId = useChainId()

  const inspectorContractAddressToUse =
    chainId === 250225 ? inspectorAddress : sequoiaInspectorAddress
  const inspectorAbiToUse = chainId === 250225 ? inspectorAbi : sequoiaInspectorAbi

  const inspectionContractAddressToUse =
    chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress
  const inspectionAbiToUse = chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi

  if (mainAction) {
    return (
      <ActionComponent
        actionName="acceptInspection"
        addressContract={inspectionContractAddressToUse}
        abi={inspectionAbiToUse as Abi}
        mainAction
      />
    )
  }

  return (
    <div className="flex flex-col">
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
  )
}
