import { sequoiaDeveloperAbi, sequoiaDeveloperAddress } from '@renderer/services/contracts'
import { DeveloperProps } from '@renderer/types/developer'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'

export function DeveloperData(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: chainId === 1600 ? sequoiaDeveloperAddress : sequoiaDeveloperAddress,
    abi: chainId === 1600 ? sequoiaDeveloperAbi : sequoiaDeveloperAbi,
    functionName: 'getDeveloper',
    args: [address]
  })

  const developer = data as DeveloperProps
  console.log(developer)

  return (
    <div className="flex flex-col">
      <Jazzicon className="w-20 h-20" address={address as string} />

      <p className="text-white mt-5">{address}</p>
      {developer && (
        <div className="flex flex-col">
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('id')}: </span>
            {formatUnits(BigInt(developer?.id), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('name')}: </span>
            {developer?.name}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('proofPhoto')}: </span>
            {developer?.proofPhoto}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('totalReports')}: </span>
            {formatUnits(BigInt(developer?.totalReports), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('lastPublishedAt')}: </span>
            {formatUnits(BigInt(developer?.lastPublishedAt), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('poolEra')}: </span>
            {formatUnits(BigInt(developer?.pool?.currentEra), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('poolLevel')}: </span>
            {formatUnits(BigInt(developer?.pool?.level), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('registeredAt')}: </span>
            {formatUnits(BigInt(developer?.createdAt), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('userType')}: </span> 4
          </p>
        </div>
      )}
    </div>
  )
}
