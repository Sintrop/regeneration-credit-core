import { useState } from 'react'
import { ContractListProps, MethodAbiProps } from '@renderer/types/contract'
import { MethodContent } from './MethodContent/MethodContent'
import { MethodTag } from './MethodTag'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'

interface Props {
  method?: MethodAbiProps
  contract: ContractListProps
}

export function MethodItem({ method, contract }: Props): JSX.Element {
  const [openMethod, setOpenMethod] = useState(false)

  function toggleOpenMethod(): void {
    setOpenMethod((value) => !value)
  }

  if (!method) return <div />

  if (!method.name) return <div />

  if (method.type !== 'function') return <div />

  return (
    <div className="flex flex-col w-full px-4 py-3 bg-card-primary rounded-xl">
      <button
        className="flex items-center justify-between gap-3 text-white font-mono text-sm hover:cursor-pointer"
        onClick={toggleOpenMethod}
      >
        <div className="flex items-center gap-3">
          <MethodTag methodType={method.stateMutability} />
          {method.name}
        </div>

        {openMethod ? <FaChevronUp color="white" /> : <FaChevronDown color="white" />}
      </button>

      {openMethod && <MethodContent method={method} contract={contract} />}
    </div>
  )
}
