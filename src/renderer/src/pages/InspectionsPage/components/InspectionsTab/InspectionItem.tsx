import { useChainId, useReadContract } from 'wagmi'
import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { InspectionProps } from '@renderer/types/inspection'
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

interface Props {
  id: number
}

export function InspectionItem({ id }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const chainId = useChainId()
  const [showVote, setShowVote] = useState(false)
  const [showAccept, setShowAccept] = useState(false)
  const { data } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    functionName: 'getInspection',
    args: [id]
  })

  const { blockNumber } = useCurrentBlock()
  const inspection = data as InspectionProps
  const inspectionStatus = data ? parseInt(formatUnits(BigInt(inspection?.status), 0)) : 0
  const createdAt = data ? parseInt(formatUnits(BigInt(inspection?.createdAt), 0)) : 0
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
        {canAccept
          ? t('common.yes')
          : `${t('common.wait')} ${createdAt + delayToAccept - blockNumber} ${t('common.blocks')}`}
      </td>
      <td className="p-2">{inspection && formatUnits(BigInt(inspection?.treesResult), 0)}</td>
      <td className="p-2">
        {inspection && formatUnits(BigInt(inspection?.biodiversityResult), 0)}
      </td>
      <td className="p-2">{inspection && formatUnits(BigInt(inspection?.regenerationScore), 0)}</td>
      <td className="p-2">{inspection && formatUnits(BigInt(inspection?.validationsCount), 0)}</td>
      <td className="p-2 flex items-center gap-5">
        {inspectionStatus === 0 && (
          <>
            {canAccept && (
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
