import { AddDelation } from './actions/AddDelation'
import { BurnTokens } from './actions/BurnTokens'
import { Invite } from './actions/Invite'

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
  }
}

export type ActionsNameType = keyof typeof actionsList
