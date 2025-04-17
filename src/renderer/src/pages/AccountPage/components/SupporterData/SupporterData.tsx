import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { SupporterProps } from '@renderer/types/supporter'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { UserContentTabs } from '../Tabs/UserContentTabs'

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

  const publicationsCount = supporter
    ? parseInt(formatUnits(BigInt(supporter?.publicationsCount), 0))
    : 0

  const offsetsCount = supporter ? parseInt(formatUnits(BigInt(supporter?.offsetsCount), 0)) : 0

  return (
    <div className="flex flex-col">
      <Jazzicon className="w-20 h-20" address={address as string} />

      <p className="text-white mt-5">{address}</p>
      {supporter && (
        <div className="flex flex-col">
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('id')}: </span>
            {formatUnits(BigInt(supporter?.id), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('name')}: </span>
            {supporter?.name}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('registeredAt')}: </span>
            {formatUnits(BigInt(supporter?.createdAt), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('userType')}: </span> 7
          </p>
        </div>
      )}

      <UserContentTabs
        address={address}
        availableTabs={['certificates', 'invitation', 'publications', 'offsets']}
        name={supporter && supporter?.name}
        publicationsCount={publicationsCount}
        offsetsCount={offsetsCount}
      />
    </div>
  )
}
