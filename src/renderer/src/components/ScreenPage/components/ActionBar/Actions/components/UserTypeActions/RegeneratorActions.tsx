import {
  regeneratorAbi,
  regeneratorAddress,
  inspectionAbi,
  inspectionAddress
} from '@renderer/services/contracts'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function RegeneratorActions(): JSX.Element {
  const regeneratorContractAddressToUse = regeneratorAddress
  const regeneratorAbiToUse = regeneratorAbi

  const inspectionContractAddressToUse = inspectionAddress
  const inspectionAbiToUse = inspectionAbi

  return (
    <div className="flex flex-col">
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
  )
}
