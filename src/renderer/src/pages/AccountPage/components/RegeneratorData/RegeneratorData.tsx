import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { RegeneratorProps } from '@renderer/types/regenerator'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { ProofPhoto } from '../ProofPhoto/ProofPhoto'
import { UserContentTabs } from '../Tabs/UserContentTabs'
import { RegenerationAreaMap } from './RegenerationAreaMap'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'

export function RegeneratorData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getRegenerator',
    args: [address]
  })

  const regenerator = data as RegeneratorProps

  return (
    <div className="flex flex-col">
      <ProofPhoto address={address} hash={regenerator && regenerator?.proofPhoto} />

      <div className="flex flex-wrap gap-10">
        {regenerator && (
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-white mt-5">{address}</p>
            <p className="text-white">
              <span className="text-white font-bold">{t('id')}: </span>
              {formatUnits(BigInt(regenerator?.id), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('name')}: </span>
              {regenerator?.name}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('proofPhoto')}: </span>
              {regenerator?.proofPhoto}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('totalArea')}: </span>
              {formatUnits(BigInt(regenerator?.totalArea), 0)} m²
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('totalInspections')}: </span>
              {formatUnits(BigInt(regenerator?.totalInspections), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('lastRequestAt')}: </span>
              {formatUnits(BigInt(regenerator?.lastRequestAt), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('regenerationScore')}: </span>
              {formatUnits(BigInt(regenerator?.regenerationScore?.score), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('eraPool')}: </span>
              {formatUnits(BigInt(regenerator?.pool?.currentEra), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('registeredAt')}: </span>
              {formatUnits(BigInt(regenerator?.createdAt), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('userType')}: </span> 1
            </p>
          </div>
        )}

        <div className="flex flex-col gap-5">
          <RegenerationAreaMap address={address} />
          {!profilePage && <VoteToInvalidate resourceType="user" userWallet={address} />}
        </div>
      </div>

      <UserContentTabs
        address={address}
        availableTabs={[
          'inspections',
          'certificates',
          'regenerationArea',
          'invitation',
          'validations'
        ]}
      />
    </div>
  )
}
