import { useChainId, useReadContract } from 'wagmi'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { CalculatorItemProps } from '@renderer/types/researcher'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'

interface Props {
  id: number
}

export function CalculatorItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getCalculatorItem',
    args: [id]
  })

  const calculatorItem = data as CalculatorItemProps

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2 max-w-[100px]">
        {calculatorItem && <UserAddressLink address={calculatorItem?.createdBy} />}
      </td>
      <td className="p-2">{calculatorItem && calculatorItem?.item}</td>
      <td className="p-2">{calculatorItem && calculatorItem?.unit}</td>
      <td className="p-2">
        {calculatorItem &&
          Intl.NumberFormat('pt-BR').format(
            parseInt(formatUnits(BigInt(calculatorItem?.carbonImpact), 0))
          )}
      </td>
      <td className="p-2"></td>
    </tr>
  )
}
