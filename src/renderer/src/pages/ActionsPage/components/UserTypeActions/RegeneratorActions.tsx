/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MethodItem } from '@renderer/pages/ContractPage/components/MethodItem/MethodItem'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress,
  contractsMainnet,
  contractsSequoia,
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'

export function RegeneratorActions(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const regeneratorContract =
    chainId === 250225
      ? contractsMainnet.find((contract) => contract.address === regeneratorAddress)
      : contractsSequoia.find((contract) => contract.address === sequoiaRegeneratorAddress)
  const regeneratorAbiToUse = chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi
  const withdrawMethod = regeneratorAbiToUse.find((method) => method.name === 'withdraw')

  const inspectionContract =
    chainId === 250225
      ? contractsMainnet.find((contract) => contract.address === inspectionAddress)
      : contractsSequoia.find((contract) => contract.address === sequoiaInspectionAddress)
  const inspectionAbiToUse = chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi
  const requestInspectionMethod = inspectionAbiToUse.find(
    (method) => method.name === 'requestInspection'
  )

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('regeneratorActions')}</p>

      {regeneratorContract && (
        <MethodItem
          contract={regeneratorContract}
          //@ts-ignore
          method={withdrawMethod}
        />
      )}

      {inspectionContract && (
        <MethodItem
          contract={inspectionContract}
          //@ts-ignore
          method={requestInspectionMethod}
        />
      )}
    </div>
  )
}
