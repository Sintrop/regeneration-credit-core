import { Abi } from 'viem'

import * as C from '../contracts'
import { TimerKey, UserTimer } from './userTimers'

type ActionName =
  | 'requestInspection'
  | 'addResearch'
  | 'addCalculatorItem'
  | 'addReport'
  | 'addContribution'
  | 'invite'
  | 'withdraw'
  | 'offsetting'

/** Opens an existing action modal with the contract it writes to. */
export interface ModalTarget {
  type: 'modal'
  actionName: ActionName
  addressContract: string
  abi: Abi
  userTypeToInvite?: number
}

/** Actions that need the user to pick an item first happen on a list screen. */
export interface RouteTarget {
  type: 'route'
  path: string
}

export interface TimerRow {
  /** Unique per row: the activist invite timer becomes two rows. */
  id: string
  timer: UserTimer
  /** i18n key for the row label. */
  label: string
  target?: ModalTarget | RouteTarget
}

const USER_CONTRACT: Record<number, { address: string; abi: unknown }> = {
  1: { address: C.regeneratorAddress, abi: C.regeneratorAbi },
  2: { address: C.inspectorAddress, abi: C.inspectorAbi },
  3: { address: C.researcherAddress, abi: C.researcherAbi },
  4: { address: C.developerAddress, abi: C.developerAbi },
  5: { address: C.contributorAddress, abi: C.contributorAbi },
  6: { address: C.activistAddress, abi: C.activistAbi },
  7: { address: C.supporterAddress, abi: C.supporterAbi }
}

const VOTE_ROUTE: Record<number, string> = {
  3: '/researches',
  4: '/development',
  5: '/contributions'
}

const PUBLISH_ACTION: Partial<Record<TimerKey, ActionName>> = {
  publishResearch: 'addResearch',
  publishCalculatorItem: 'addCalculatorItem',
  publishReport: 'addReport',
  publishContribution: 'addContribution'
}

function modal(
  actionName: ActionName,
  contract: { address: string; abi: unknown },
  userTypeToInvite?: number
): ModalTarget {
  return {
    type: 'modal',
    actionName,
    addressContract: contract.address,
    abi: contract.abi as Abi,
    userTypeToInvite
  }
}

/** Maps each timer to its row label and the action it opens, mirroring the Actions menu wiring. */
export function timerRows(timers: UserTimer[], userType: number): TimerRow[] {
  const own = USER_CONTRACT[userType]
  const inspection = { address: C.inspectionAddress, abi: C.inspectionAbi }
  const rows: TimerRow[] = []

  for (const timer of timers) {
    const row = (label: string, target?: TimerRow['target'], id: string = timer.key): void => {
      rows.push({ id, timer, label, target })
    }
    const publishAction = PUBLISH_ACTION[timer.key]

    if (publishAction && own) {
      row(`timers.actions.${timer.key}`, modal(publishAction, own))
      continue
    }

    switch (timer.key) {
      case 'requestInspection':
        row('timers.actions.requestInspection', modal('requestInspection', inspection))
        break
      case 'acceptInspection':
        row('timers.actions.acceptInspection', { type: 'route', path: '/inspections' })
        break
      case 'vote':
        row(
          'timers.actions.vote',
          VOTE_ROUTE[userType] ? { type: 'route', path: VOTE_ROUTE[userType] } : undefined
        )
        break
      case 'invite':
        if (userType === 7) {
          const invitation = { address: C.invitationAddress, abi: C.invitationAbi }
          row('timers.actions.inviteSupporter', modal('invite', invitation, 7))
        } else if (own) {
          row(
            userType === 6 ? 'actions.inviteActivist' : 'timers.actions.invite',
            modal('invite', own, userType)
          )
        }
        break
      case 'inviteRegeneratorInspector':
        if (own) {
          row('actions.inviteRegenerator', modal('invite', own, 1), 'inviteRegenerator')
          row('actions.inviteInspector', modal('invite', own, 2), 'inviteInspector')
        }
        break
      case 'withdraw':
        if (own) row('timers.actions.withdraw', modal('withdraw', own))
        break
      case 'offset':
        row('timers.actions.offset', modal('offsetting', { address: C.rcAddress, abi: C.rcAbi }))
        break
      default:
        row(`timers.actions.${timer.key}`)
    }
  }
  return rows
}
