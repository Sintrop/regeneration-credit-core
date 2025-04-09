/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MethodItem } from '@renderer/pages/ContractPage/components/MethodItem/MethodItem'
import {
  contractsMainnet,
  contractsSequoia,
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

export function InspectorActions(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const inspectorContract =
    chainId === 250225
      ? contractsMainnet.find((contract) => contract.address === inspectorAddress)
      : contractsSequoia.find((contract) => contract.address === sequoiaInspectorAddress)
  const inspectorAbiToUse = chainId === 250225 ? inspectorAbi : sequoiaInspectorAbi
  const withdrawMethod = inspectorAbiToUse.find((method) => method.name === 'withdraw')

  const inspectionContract =
    chainId === 250225
      ? contractsMainnet.find((contract) => contract.address === inspectionAddress)
      : contractsSequoia.find((contract) => contract.address === sequoiaInspectionAddress)
  const inspectionAbiToUse = chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi
  const acceptInspectionMethod = inspectionAbiToUse.find(
    (method) => method.name === 'acceptInspection'
  )
  const realizeInspectionMethod = inspectionAbiToUse.find(
    (method) => method.name === 'realizeInspection'
  )

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('regeneratorActions')}</p>

      {inspectorContract && (
        <MethodItem
          contract={inspectorContract}
          //@ts-ignore
          method={withdrawMethod}
        />
      )}

      {inspectionContract && (
        <>
          <MethodItem
            contract={inspectionContract}
            //@ts-ignore
            method={acceptInspectionMethod}
          />

          <MethodItem
            contract={inspectionContract}
            //@ts-ignore
            method={realizeInspectionMethod}
          />
        </>
      )}
    </div>
  )
}
