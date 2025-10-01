import { formatUnits } from 'viem'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { StatusInspection } from './StatusInspection'
import { useNavigate } from 'react-router-dom'
import { FaRegEye } from 'react-icons/fa'
import { BiSolidMegaphone } from 'react-icons/bi'
import { useState } from 'react'
import { VoteInspection } from '@renderer/components/Votes/VoteInspection'
import { AcceptInspection } from './AcceptInspection'
import { MdTouchApp } from 'react-icons/md'
import { useCurrentBlock } from '@renderer/domain/Chain/useCases/useBlockNumber'
import { useTranslation } from 'react-i18next'
import { useGetInspection } from '@renderer/domain/Inspection/useCases/useGetInspection'

interface Props {
  id: number
}

export function InspectionItem({ id }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { inspection, refetch } = useGetInspection({ inspectionId: id })
  const [showVote, setShowVote] = useState(false)
  const [showAccept, setShowAccept] = useState(false)

  const { blockNumber } = useCurrentBlock()

  const expireIn = parseInt(import.meta.env.VITE_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION)
  const inspectionStatus =
    inspection.status === 1
      ? inspection.acceptedAt + expireIn < blockNumber
        ? 4
        : 1
      : inspection.status
  const createdAt = inspection?.createdAt
  const delayToAccept = parseInt(import.meta.env.VITE_ACCEPT_INSPECTION_DELAY_BLOCKS)
  const canAccept = createdAt + delayToAccept < blockNumber

  function handleGoToInspectionDetails(): void {
    navigate(`/resource-details/inspection/${id}`)
  }

  function handleShowVote(): void {
    setShowVote(true)
  }

  function handleShowAccept(): void {
    setShowAccept(true)
  }

  function handleCloseAccept(): void {
    setShowAccept(false)
    refetch()
  }

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2 max-w-[180px]">
        {inspection && <UserAddressLink address={inspection?.regenerator} />}
      </td>
      <td className="p-2 max-w-[180px]">
        {inspection && <UserAddressLink address={inspection?.inspector} />}
      </td>
      <td className="p-2">{inspection && <StatusInspection status={inspectionStatus} />}</td>
      <td className="p-2">
        {canAccept ? t('common.yes') : createdAt + delayToAccept - blockNumber}
      </td>
      <td className="p-2">{inspection?.treesResult}</td>
      <td className="p-2">{inspection?.biodiversityResult}</td>
      <td className="p-2">{inspection?.regenerationScore}</td>
      <td className="p-2">{inspection?.validationsCount}</td>
      <td className="p-2 flex items-center gap-5">
        {canAccept && (
          <>
            {inspectionStatus === 0 && (
              <button className="hover:cursor-pointer" onClick={handleShowAccept}>
                <MdTouchApp color="white" />
              </button>
            )}

            {inspectionStatus === 4 && (
              <button className="hover:cursor-pointer" onClick={handleShowAccept}>
                <MdTouchApp color="white" />
              </button>
            )}
          </>
        )}
        <button className="hover:cursor-pointer" onClick={handleGoToInspectionDetails}>
          <FaRegEye color="white" />
        </button>
        {inspectionStatus > 1 && (
          <button className="hover:cursor-pointer" onClick={handleShowVote}>
            <BiSolidMegaphone color="white" />
          </button>
        )}
      </td>

      {showVote && (
        <VoteInspection
          close={() => setShowVote(false)}
          inspectionId={id}
          inspectedEra={parseInt(formatUnits(BigInt(inspection?.inspectedAtEra), 0))}
        />
      )}

      {showAccept && (
        <AcceptInspection
          inspectionId={id}
          createdAt={inspection ? parseInt(formatUnits(BigInt(inspection?.createdAt), 0)) : 0}
          close={handleCloseAccept}
        />
      )}
    </tr>
  )
}
