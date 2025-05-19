import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiSolidMegaphone } from 'react-icons/bi'
import { VoteInspection } from '../Votes/VoteInspection'
import { VoteContribution } from '../Votes/VoteContribution'
import { VoteReport } from '../Votes/VoteReport'
import { VoteResearch } from '../Votes/VoteResearch'
import { VoteUser } from '../Votes/VoteUser'

interface Props {
  resourceType: 'inspection' | 'research' | 'report' | 'contribution' | 'user'
  resourceId?: number
  userWallet?: string
}

export function VoteToInvalidate({ resourceType, resourceId, userWallet }: Props): JSX.Element {
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
        className="px-10 h-10 w-fit rounded-2xl font-semibold text-white bg-red-500 flex items-center justify-center gap-3 hover:cursor-pointer"
        onClick={handleShowVote}
      >
        <BiSolidMegaphone color="white" />
        {t('voteToInvalidate')}
      </button>

      {showVote && (
        <>
          {resourceType === 'inspection' && (
            <VoteInspection close={handleCloseVote} inspectionId={resourceId ? resourceId : 0} />
          )}

          {resourceType === 'contribution' && (
            <VoteContribution
              close={handleCloseVote}
              contributionId={resourceId ? resourceId : 0}
            />
          )}

          {resourceType === 'report' && (
            <VoteReport close={handleCloseVote} reportId={resourceId ? resourceId : 0} />
          )}

          {resourceType === 'research' && (
            <VoteResearch close={handleCloseVote} researchId={resourceId ? resourceId : 0} />
          )}

          {resourceType === 'user' && (
            <VoteUser close={handleCloseVote} userWallet={userWallet ? userWallet : ''} />
          )}
        </>
      )}
    </div>
  )
}
