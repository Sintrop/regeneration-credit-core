import {
  developerAddress,
  sequoiaDeveloperAddress,
  developerAbi,
  sequoiaDeveloperAbi
} from '@renderer/services/contracts'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { Img } from 'react-image'
import { DeveloperProps } from '@renderer/types/developer'

interface Props {
  address?: string
  isLoading?: boolean
  publishedAt?: string
}

export function ReportFeedHeader({ address, publishedAt }: Props): JSX.Element {
  const navigate = useNavigate()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getDeveloper',
    args: [address]
  })

  const developer = data as DeveloperProps

  function handleGoToUserDetails(): void {
    navigate(`/user-details/${address}`)
  }

  return (
    <div className="flex items-center gap-3 pb-3">
      <div className="relative w-8 h-8 rounded-full">
        <Jazzicon className="w-full h-full z-0" address={address ? (address as string) : ''} />

        {developer && (
          <Img
            src={`https://ipfs.io/ipfs/${developer?.proofPhoto}`}
            className="w-full h-full rounded-full object-cover absolute top-0 left-0 z-10"
          />
        )}
      </div>

      <div className="flex flex-col">
        <p
          className="text-white hover:cursor-pointer hover:underline text-xs"
          onClick={handleGoToUserDetails}
        >
          {developer ? developer?.name : address}
        </p>

        {publishedAt && (
          <p className="text-gray-300 text-xs">
            {t('publishedAt')}: {formatUnits(BigInt(publishedAt), 0)}
          </p>
        )}
      </div>
    </div>
  )
}
