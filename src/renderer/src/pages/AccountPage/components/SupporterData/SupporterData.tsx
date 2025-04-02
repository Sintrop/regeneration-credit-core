import { sequoiaSupporterAbi, sequoiaSupporterAddress } from '@renderer/services/contracts'
import { SupporterProps } from '@renderer/types/supporter'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'

export function SupporterData(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: chainId === 1600 ? sequoiaSupporterAddress : sequoiaSupporterAddress,
    abi: chainId === 1600 ? sequoiaSupporterAbi : sequoiaSupporterAbi,
    functionName: 'getSupporter',
    args: [address]
  })

  const supporter = data as SupporterProps

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
    </div>
  )
}
