import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiSolidMegaphone } from 'react-icons/bi'
import { VoteModal } from '../Votes/VoteModal'

interface Props {
  resourceType: 'inspection' | 'research' | 'report' | 'contribution' | 'user'
  resourceId?: number
  userWallet?: string
  wFull?: boolean
}

export function VoteToInvalidate({
  resourceType,
  resourceId,
  userWallet,
  wFull
}: Props): JSX.Element {
  const { t } = useTranslation()
  const [showVote, setShowVote] = useState<boolean>(false)

  function handleShowVote(): void {
    setShowVote(true)
  }

  function handleCloseVote(): void {
    setShowVote(false)
  }

  return (
    <div className="">
      <button
        className={`px-10 h-10 ${wFull ? 'w-full' : 'w-fit'} rounded-2xl font-semibold text-white bg-red-500 flex items-center justify-center gap-3 hover:cursor-pointer`}
        onClick={handleShowVote}
      >
        <BiSolidMegaphone color="white" />
        {t('vote.voteToInvalidate')}
      </button>

      {showVote && (
        <VoteModal
          kind={resourceType}
          target={resourceType === 'user' ? (userWallet ?? '') : (resourceId ?? 0)}
          close={handleCloseVote}
        />
      )}
    </div>
  )
}
