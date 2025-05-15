import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { DeveloperProps } from '@renderer/types/developer'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { ProofPhoto } from '../ProofPhoto/ProofPhoto'
import { UserContentTabs } from '../Tabs/UserContentTabs'

export function DeveloperData({ address }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getDeveloper',
    args: [address]
  })

  const developer = data as DeveloperProps

  const reportsCount = developer ? parseInt(formatUnits(BigInt(developer?.totalReports), 0)) : 0

  return (
    <div className="flex flex-col">
      <ProofPhoto address={address} hash={developer && developer?.proofPhoto} />

      <p className="text-white mt-5">{address}</p>
      {developer && (
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-white">
            <span className="text-white font-bold">{t('id')}: </span>
            {formatUnits(BigInt(developer?.id), 0)}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('name')}: </span>
            {developer?.name}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('proofPhoto')}: </span>
            {developer?.proofPhoto}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('totalReports')}: </span>
            {formatUnits(BigInt(developer?.totalReports), 0)}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('lastPublishedAt')}: </span>
            {formatUnits(BigInt(developer?.lastPublishedAt), 0)}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('poolEra')}: </span>
            {formatUnits(BigInt(developer?.pool?.currentEra), 0)}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('poolLevel')}: </span>
            {formatUnits(BigInt(developer?.pool?.level), 0)}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('registeredAt')}: </span>
            {formatUnits(BigInt(developer?.createdAt), 0)}
          </p>
          <p className="text-white">
            <span className="text-white font-bold">{t('userType')}: </span> 4
          </p>
        </div>
      )}

      <UserContentTabs
        address={address}
        availableTabs={['certificates', 'invitation', 'reports']}
        reportsCount={reportsCount}
      />
    </div>
  )
}
