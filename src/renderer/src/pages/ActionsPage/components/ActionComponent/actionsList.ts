import { AcceptInspection } from './actions/AcceptInspection'
import { AddCalculatorItem } from './actions/AddCalculatorItem'
import { AddDelation } from './actions/AddDelation'
import { AddResearch } from './actions/AddResearch'
import { AddResearchValidation } from './actions/AddResearchValidation'
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
  },
  acceptInspection: {
    name: 'acceptInspection',
    description: 'shortDescriptionAcceptInspection',
    component: AcceptInspection
  },
  addResearch: {
    name: 'addResearch',
    description: 'shortDescriptionaddResearch',
    component: AddResearch
  },
  addResearchValidation: {
    name: 'addResearchValidation',
    description: 'shortDescriptionaddResearchValidation',
    component: AddResearchValidation
  },
  addCalculatorItem: {
    name: 'addCalculatorItem',
    description: 'shortDescriptionaddCalculatorItem',
    component: AddCalculatorItem
  }
}

export type ActionsNameType = keyof typeof actionsList
