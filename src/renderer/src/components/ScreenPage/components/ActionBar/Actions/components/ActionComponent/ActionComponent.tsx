import { useState } from 'react'
import { actionsList, ActionsNameType } from './actionsList'
import { Abi } from 'viem'

export interface ActionContractProps {
  addressContract?: string
  abi?: Abi
}

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
    <>
      <button
        className="w-30 h-8 rounded-2xl text-xs bg-blue-primary text-white hover:cursor-pointer hover:bg-blue-primary/90 duration-300"
        onClick={toggleOpenAction}
      >
        {Action.name}
      </button>

      {openAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-96">
            <div className="flex items-center justify-between w-full">
              <p className="text-white">{Action.name}</p>
              <button className="hover:cursor-pointer text-white" onClick={toggleOpenAction}>
                X
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <Action.component addressContract={addressContract} abi={abi} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
