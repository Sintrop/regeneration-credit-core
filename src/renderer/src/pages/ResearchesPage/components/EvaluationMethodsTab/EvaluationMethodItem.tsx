import { useChainId, useReadContract } from 'wagmi'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'

interface Props {
  id: number
}

export function EvaluationMethodItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'evaluationMethods',
    args: [id]
  })

  if (data) {
    return (
      <tr className="border-b border-container-primary text-white">
        <td className="p-2">{id}</td>
        <td className="p-2">{<UserAddressLink address={data[1]} />}</td>
        <td className="p-2">{data[2]}</td>
        <td className="p-2">{data[3]}</td>
        <td className="p-2">{data[4]}</td>
        <td className="p-2"></td>
      </tr>
    )
  }

  return <tr />
}
