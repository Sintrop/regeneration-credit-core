import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import {
  sequoiaValidationAbi,
  sequoiaValidationAddress,
  validationAbi,
  validationAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  resourceId: number
  validation: number
}

export function ReportValidationItem({ resourceId, validation }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? validationAddress : sequoiaValidationAddress,
    abi: chainId === 250225 ? validationAbi : sequoiaValidationAbi,
    functionName: 'reportValidations',
    args: [resourceId, validation]
  })


  return (
    <div className="w-full p-3 rounded-2xl bg-green-card flex flex-col">
      <div className="flex items-center gap-2">
        <p className="text-white">{t('validator')}: </p>
        <UserAddressLink address={data && data[0]} />
      </div>
      <div className="flex items-center gap-2">
        <p className="text-white">{t('justification')}: </p>
        <p className="text-white">{data && data[2]}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-white">{t('votesToInvalidate')}: </p>
        <p className="text-white">{data ? formatUnits(BigInt(data[3]), 0) : 0}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-white">{t('createdAt')}: </p>
        <p className="text-white">{data ? formatUnits(BigInt(data[4]), 0) : 0}</p>
      </div>
    </div>
  )
}
