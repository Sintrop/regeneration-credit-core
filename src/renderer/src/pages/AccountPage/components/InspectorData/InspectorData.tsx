import { sequoiaInspectorAbi, sequoiaInspectorAddress } from '@renderer/services/contracts'
import { InspectorProps } from '@renderer/types/inspector'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'

export function InspectorData(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: chainId === 1600 ? sequoiaInspectorAddress : sequoiaInspectorAddress,
    abi: chainId === 1600 ? sequoiaInspectorAbi : sequoiaInspectorAbi,
    functionName: 'getInspector',
    args: [address]
  })

  const inspector = data as InspectorProps

  return (
    <div className="flex flex-col">
      <Jazzicon className="w-20 h-20" address={address as string} />

      <p className="text-white mt-5">{address}</p>
      {inspector && (
        <div className="flex flex-col">
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('id')}: </span>
            {formatUnits(BigInt(inspector?.id), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('name')}: </span>
            {inspector?.name}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('proofPhoto')}: </span>
            {inspector?.proofPhoto}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('totalInspections')}: </span>
            {formatUnits(BigInt(inspector?.totalInspections), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('lastAcceptedAt')}: </span>
            {formatUnits(BigInt(inspector?.lastAcceptedAt), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('lastInspection')}: </span>
            {formatUnits(BigInt(inspector?.lastInspection), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('level')}: </span>
            {formatUnits(BigInt(inspector?.pool?.level), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('eraPool')}: </span>
            {formatUnits(BigInt(inspector?.pool?.currentEra), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('registeredAt')}: </span>
            {formatUnits(BigInt(inspector?.createdAt), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('userType')}: </span> 2
          </p>
        </div>
      )}
    </div>
  )
}
