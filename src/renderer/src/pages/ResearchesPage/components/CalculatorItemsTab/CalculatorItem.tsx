import { useChainId, useReadContract } from 'wagmi'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { CalculatorItemProps } from '@renderer/types/researcher'

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
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary flex-1 pl-5">
        <p className="text-white">{calculatorItem && calculatorItem?.createdBy}</p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white">{calculatorItem && calculatorItem?.title}</p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white">{calculatorItem && calculatorItem?.unit}</p>
      </div>

      <div className="border-r border-container-secondary w-[200px] pl-5 overflow-hidden">
        <p className="text-white">
          {calculatorItem && formatUnits(BigInt(calculatorItem?.carbonImpact), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
