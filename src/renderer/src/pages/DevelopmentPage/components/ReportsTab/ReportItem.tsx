import { useChainId, useReadContract } from 'wagmi'
import { ReportProps } from '@renderer/types/developer'
import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { FaRegEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BiSolidMegaphone } from 'react-icons/bi'
import { VoteReport } from '@renderer/components/Votes/VoteReport'
import { ValidTag } from '@renderer/components/ValidTag/ValidTag'

interface Props {
  id: number
}

export function ReportItem({ id }: Props): JSX.Element {
  const navigate = useNavigate()
  const chainId = useChainId()
  const [showVote, setShowVote] = useState(false)
  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getReport',
    args: [id]
  })

  const report = data as ReportProps

  function handleGoToReportDetails(): void {
    navigate(`/resource-details/report/${id}`)
  }

  function handleShowVote(): void {
    setShowVote(true)
  }

  if (report) {
    return (
      <tr className="border-b border-container-primary text-white">
        <td className="p-2">{id}</td>
        <td className="p-2">{<UserAddressLink address={report?.developer} />}</td>
        <td className="p-2">{formatUnits(BigInt(report?.createdAtBlockNumber), 0)}</td>
        <td className="p-2">{formatUnits(BigInt(report?.era), 0)}</td>
        <td className="p-2">{formatUnits(BigInt(report?.validationsCount), 0)}</td>
        <td className="p-2">
          <ValidTag valid={report.valid.toString() === 'true' ? true : false} />
        </td>
        <td className="p-2 flex items-center gap-5">
          <button className="hover:cursor-pointer" onClick={handleGoToReportDetails}>
            <FaRegEye color="white" />
          </button>
  
          <button className="hover:cursor-pointer" onClick={handleShowVote}>
            <BiSolidMegaphone color="white" />
          </button>
        </td>
  
        {showVote && (
          <VoteReport
            reportId={id}
            close={() => setShowVote(false)}
            publishedEra={parseInt(formatUnits(BigInt(report?.era), 0))}
          />
        )}
      </tr>
    )
  }

  return <tr />
}
