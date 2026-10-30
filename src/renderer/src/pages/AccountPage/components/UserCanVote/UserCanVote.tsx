import { DataRow } from '@renderer/components/DataRow/DataRow'
import { voteAbi, voteAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useReadContract } from 'wagmi'

interface Props {
  address: string
}

export function UserCanVote({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const { data } = useReadContract({
    address: voteAddress,
    abi: voteAbi,
    functionName: 'canVote',
    args: [address]
  })

  const canVote = data ? (data.toString() === 'true' ? true : false) : false

  return <DataRow label={t('account.canVote')} value={canVote ? t('common.yes') : t('common.no')} />
}
