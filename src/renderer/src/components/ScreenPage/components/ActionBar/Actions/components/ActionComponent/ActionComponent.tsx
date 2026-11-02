import { ReactNode, useState } from 'react'
import { Abi } from 'viem'
import { useTranslation } from 'react-i18next'
import { Modal } from '@renderer/components/Modal/Modal'

import { actionsList, ActionsNameType } from './actionsList'

export interface ActionContractProps {
  addressContract?: string
  abi?: Abi
  lastPublishedWork?: number
  userTypeToInvite?: number
  close: () => void
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
  hideNextLevel?: boolean
  /** Replaces the default button; receives the function that opens the action. */
  renderTrigger?: (open: () => void) => ReactNode
}
export function ActionComponent({
  actionName,
  addressContract,
  abi,
  lastPublishedWork,
  userTypeToInvite,
  label,
  mainAction,
  withdrawPools,
  hideNextLevel,
  renderTrigger
}: Props): JSX.Element {
  const { t } = useTranslation()
  const [openAction, setOpenAction] = useState(false)
  const Action = actionsList[actionName]

  function toggleOpenAction(): void {
    setOpenAction((value) => !value)
  }

  return (
    <>
      {renderTrigger ? (
        renderTrigger(toggleOpenAction)
      ) : withdrawPools ? (
        <button
          className="font-semibold text-white rounded-2xl bg-blue-primary px-5 h-10 hover:cursor-pointer"
          onClick={toggleOpenAction}
        >
          {label ? label : t(`actions.${Action.name}`)}
        </button>
      ) : (
        <>
          {mainAction ? (
            <div className="flex flex-col gap-1">
              {!hideNextLevel && <p className="text-sm text-gray-300">{t('actions.nextLevel')}</p>}
              <button
                className="w-full h-10 text-x text-white bg-green-500 hover:cursor-pointer px-5 rounded-2xl"
                onClick={toggleOpenAction}
              >
                {label ? label : t(`actions.${Action.name}`)}
              </button>
            </div>
          ) : (
            <button
              className="w-full h-10 px-3 rounded-xl text-left text-sm text-white hover:cursor-pointer hover:bg-card-secondary duration-150"
              onClick={toggleOpenAction}
            >
              {label ? t(`actions.${label}`) : t(`actions.${Action.name}`)}
            </button>
          )}
        </>
      )}

      {openAction && (
        <Modal
          title={label ? t(`actions.${label}`) : t(`actions.${Action.name}`)}
          onClose={toggleOpenAction}
        >
          <p className="text-gray-300 text-sm mb-4">{t(Action.description)}</p>
          <Action.component
            addressContract={addressContract}
            abi={abi}
            lastPublishedWork={lastPublishedWork}
            userTypeToInvite={userTypeToInvite}
            close={toggleOpenAction}
          />
        </Modal>
      )}
    </>
  )
}
