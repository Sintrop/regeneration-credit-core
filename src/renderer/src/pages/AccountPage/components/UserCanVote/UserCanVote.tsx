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

  return (
    <p className="text-white font-bold">
      {t('account.canVote')}:{' '}
      <span className="text-white font-normal">{canVote ? t('common.yes') : t('common.no')}</span>
    </p>
  )
}
