import {
  inspectionAbi,
  inspectionAddress,
  inspectorAbi,
  inspectorAddress
} from '@renderer/services/contracts'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function InspectorActions(): JSX.Element {
  const inspectorContractAddressToUse = inspectorAddress
  const inspectorAbiToUse = inspectorAbi

  const inspectionContractAddressToUse = inspectionAddress
  const inspectionAbiToUse = inspectionAbi

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
