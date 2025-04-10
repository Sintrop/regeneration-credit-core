import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { actionsList, ActionsNameType } from './actionsList'
import { Abi } from 'viem'

interface Props {
  actionName: ActionsNameType
  addressContract?: string
  abi?: Abi
}
export function ActionComponent({ actionName, addressContract, abi }: Props): JSX.Element {
  const [openAction, setOpenAction] = useState(false)
  const Action = actionsList[actionName]

  function toggleOpenAction(): void {
    setOpenAction((value) => !value)
  }

  return (
    <div className="flex flex-col w-full px-5 py-2 bg-container-primary rounded-2xl mb-5">
      <button
        className="flex items-center justify-between text-white hover:cursor-pointer"
        onClick={toggleOpenAction}
      >
        <div className="flex items-center gap-3">
          <p className="text-white">{Action.name}</p>
        </div>

        {openAction ? <FaChevronUp color="white" /> : <FaChevronDown color="white" />}
      </button>

      {openAction && <Action.component addressContract={addressContract} abi={abi} />}
    </div>
  )
}
