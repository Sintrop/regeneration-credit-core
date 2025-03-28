import { sequoiaRegeneratorAbi, sequoiaRegeneratorAddress } from '@renderer/services/contracts'
import { RegeneratorProps } from '@renderer/types/regenerator'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'

export function RegeneratorData(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: chainId === 1600 ? sequoiaRegeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 1600 ? sequoiaRegeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getRegenerator',
    args: [address]
  })

  const regenerator = data as RegeneratorProps

  return (
    <div className="flex flex-col">
      <Jazzicon className="w-20 h-20" address={address as string} />

      <p className="text-white mt-5">{address}</p>
      {regenerator && (
        <div className="flex flex-col">
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('id')}: </span>
            {formatUnits(BigInt(regenerator?.id), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('name')}: </span>
            {regenerator?.name}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('proofPhoto')}: </span>
            {regenerator?.proofPhoto}
          </p>
          {/* <p className="text-white mt-5">
            <span className="text-white font-bold">{t('poolEra')}: </span>
            {formatUnits(BigInt(regenerator?.pool?.currentEra), 0)}
          </p> */}
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('userType')}: </span> 1
          </p>
        </div>
      )}
    </div>
  )
}
