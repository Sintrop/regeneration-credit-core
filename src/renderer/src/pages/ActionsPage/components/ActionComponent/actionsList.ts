import { AddDelation } from './actions/AddDelation'
import { BurnTokens } from './actions/BurnTokens'
import { Invite } from './actions/Invite'
import { RequestInspection } from './actions/RequestInspection'
import { Withdraw } from './actions/Withdraw'

export const actionsList = {
  burnTokens: {
    name: 'burnTokens',
    description: 'shortDescriptionBurntokens',
    component: BurnTokens
  },
  invite: {
    name: 'invite',
    description: 'shortDescriptionInvite',
    component: Invite
  },
  addDelation: {
    name: 'addDelation',
    description: 'shortDescriptionAddDelation',
    component: AddDelation
  },
  withdraw: {
    name: 'withdraw',
    description: 'shortDescriptionWithdraw',
    component: Withdraw
  },
  requestInspection: {
    name: 'requestInspection',
    description: 'shortDescriptionRequestInspection',
    component: RequestInspection
  }
}

export type ActionsNameType = keyof typeof actionsList
