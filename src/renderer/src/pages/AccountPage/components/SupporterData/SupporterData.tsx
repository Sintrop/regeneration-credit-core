import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { SupporterProps } from '@renderer/types/supporter'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { UserContentTabs } from '../Tabs/UserContentTabs'
import { ProofPhoto } from '../ProofPhoto/ProofPhoto'

export function SupporterData({ address }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'getSupporter',
    args: [address]
  })

  const supporter = data as SupporterProps

  const offsetsCount = supporter ? parseInt(formatUnits(BigInt(supporter?.offsetsCount), 0)) : 0

  return (
    <div className="flex flex-col">
      <ProofPhoto address={address} hash={supporter?.profilePhoto} />

      <p className="text-white mt-5">{address}</p>
      {supporter && (
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-white">
            <span className="text-white font-bold">{t('id')}: </span>
            {formatUnits(BigInt(supporter?.id), 0)}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('name')}: </span>
            {supporter?.name}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('registeredAt')}: </span>
            {formatUnits(BigInt(supporter?.createdAt), 0)}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('userType')}: </span> 7
          </p>
        </div>
      )}

      <UserContentTabs
        address={address}
        availableTabs={[
          'certificates',
          'invitation',
          'publications',
          'offsets',
          'reductionCommitments'
        ]}
        name={supporter && supporter?.name}
        offsetsCount={offsetsCount}
      />
    </div>
  )
}
