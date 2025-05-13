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
import { PdfHashLink } from '@renderer/components/PdfHashLink/PdfHashLink'
import { FaRegEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface Props {
  id: number
}

export function ReportItem({ id }: Props): JSX.Element {
  const navigate = useNavigate()
  const chainId = useChainId()
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

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">{report && <UserAddressLink address={report?.developer} />}</td>
      <td className="p-2">{report && formatUnits(BigInt(report?.createdAtBlockNumber), 0)}</td>
      <td className="p-2">{report && formatUnits(BigInt(report?.era), 0)}</td>
      <td className="p-2">{report && <PdfHashLink hash={report.report} />}</td>
      <td className="p-2 flex items-center gap-3">
        <button className="hover:cursor-pointer" onClick={handleGoToReportDetails}>
          <FaRegEye color="white" />
        </button>
      </td>
    </tr>
  )
}
