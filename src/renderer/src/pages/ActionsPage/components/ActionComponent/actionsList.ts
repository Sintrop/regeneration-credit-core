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
  }
}

export type ActionsNameType = keyof typeof actionsList
