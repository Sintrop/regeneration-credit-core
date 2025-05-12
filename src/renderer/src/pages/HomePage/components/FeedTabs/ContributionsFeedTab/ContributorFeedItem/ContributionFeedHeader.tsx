import {
  contributorAddress,
  sequoiaContributorAddress,
  contributorAbi,
  sequoiaContributorAbi
} from '@renderer/services/contracts'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { Img } from 'react-image'
import { ContributorProps } from '@renderer/types/contributor'

interface Props {
  address?: string
  isLoading?: boolean
  publishedAt?: string
}

export function ContributionFeedHeader({ address, publishedAt }: Props): JSX.Element {
  const navigate = useNavigate()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'getContributor',
    args: [address]
  })

  const contributor = data as ContributorProps

  function handleGoToUserDetails(): void {
    navigate(`/user-details/${address}`)
  }

  return (
    <div className="flex items-center gap-3 border-b border-container-secondary pb-3">
      <div className="relative w-10 h-10 rounded-full">
        <Jazzicon className="w-10 h-10 z-0" address={address ? (address as string) : ''} />

        {contributor && (
          <Img
            src={`https://ipfs.io/ipfs/${contributor?.proofPhoto}`}
            className="w-full h-full rounded-full object-cover absolute top-0 left-0 z-10"
          />
        )}
      </div>

      <div className="flex flex-col">
        <p
          className="text-white hover:cursor-pointer hover:underline"
          onClick={handleGoToUserDetails}
        >
          {contributor ? contributor?.name : address}
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
