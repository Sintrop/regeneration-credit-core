import {
  sequoiaVoteAbi,
  sequoiaVoteAddress,
  voteAbi,
  voteAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  address: string
}

export function UserCanVote({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? voteAddress : sequoiaVoteAddress,
    abi: chainId === 250225 ? voteAbi : sequoiaVoteAbi,
    functionName: 'canVote',
    args: [address]
  })

  const canVote = data ? (data.toString() === 'true' ? true : false) : false

  return (
    <p className="text-white font-bold">
      {t('canVote')}: <span className="text-white font-normal">{canVote ? t('yes') : t('no')}</span>
    </p>
  )
}
