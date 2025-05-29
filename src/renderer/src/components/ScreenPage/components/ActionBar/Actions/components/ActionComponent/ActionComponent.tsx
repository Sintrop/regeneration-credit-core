import { useState } from 'react'
import { actionsList, ActionsNameType } from './actionsList'
import { Abi } from 'viem'
import { useTranslation } from 'react-i18next'

export interface ActionContractProps {
  addressContract?: string
  abi?: Abi
  lastPublishedWork?: number
  userTypeToInvite?: number
}

interface Props {
  actionName: ActionsNameType
  addressContract?: string
  abi?: Abi
  lastPublishedWork?: number
  userTypeToInvite?: number
  label?: string
  mainAction?: boolean
  withdrawPools?: boolean
}
export function ActionComponent({
  actionName,
  addressContract,
  abi,
  lastPublishedWork,
  userTypeToInvite,
  label,
  mainAction,
  withdrawPools
}: Props): JSX.Element {
  const { t } = useTranslation()
  const [openAction, setOpenAction] = useState(false)
  const Action = actionsList[actionName]

  function toggleOpenAction(): void {
    setOpenAction((value) => !value)
  }

  return (
    <>
      {withdrawPools ? (
        <button
          className="font-semibold text-white rounded-2xl bg-blue-primary px-5 h-10 hover:cursor-pointer"
          onClick={toggleOpenAction}
        >
          {label ? label : Action.name}
        </button>
      ) : (
        <>
          {mainAction ? (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-300">{t('nextLevel')}</p>
              <button
                className="w-full h-10 text-x text-white bg-green-primary hover:cursor-pointer px-5 rounded-2xl"
                onClick={toggleOpenAction}
              >
                {label ? label : Action.name}
              </button>
            </div>
          ) : (
            <button
              className="w-full h-10 text-x text-white bg-container-primary hover:cursor-pointer hover:bg-container-secondary duration-300 border-b border-container-secondary"
              onClick={toggleOpenAction}
            >
              {label ? label : Action.name}
            </button>
          )}
        </>
      )}

      {openAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-96">
            <div className="flex items-center justify-between w-full">
              <p className="text-white">{label ? label : Action.name}</p>
              <button className="hover:cursor-pointer text-white" onClick={toggleOpenAction}>
                X
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <Action.component
                addressContract={addressContract}
                abi={abi}
                lastPublishedWork={lastPublishedWork}
                userTypeToInvite={userTypeToInvite}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
