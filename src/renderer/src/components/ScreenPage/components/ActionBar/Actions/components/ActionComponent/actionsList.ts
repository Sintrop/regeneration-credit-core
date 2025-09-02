import { AcceptInspection } from './actions/Inspectors/AcceptInspection'
import { AddCalculatorItem } from './actions/Researchers/AddCalculatorItem'
import { AddDelation } from './actions/AddDelation'
import { AddResearch } from './actions/Researchers/AddResearch'
import { AddResearchValidation } from './actions/Researchers/AddResearchValidation'
import { BurnTokens } from './actions/BurnTokens'
import { AddReport } from './actions/Developers/AddReport'
import { AddReportValidation } from './actions/Developers/AddReportValidation'
import { Invite } from './actions/Invite'
import { RequestInspection } from './actions/Producers/RequestInspection'
import { Withdraw } from './actions/Withdraw'
import { AddContribution } from './actions/Contributors/AddContribution'
import { Offsetting } from './actions/Supporters/Offsetting/Offsetting'
import { RealizeInspection } from './actions/Inspectors/RealizeInspection'
import { UpdateProfilePhoto } from './actions/Supporters/UpdateProfilePhoto'
import { DeclareReduction } from './actions/Supporters/DeclareReduction/DeclareReduction'

export const actionsList = {
  burnTokens: {
    name: 'burnTokens',
    description: 'descActions.burnTokens',
    component: BurnTokens
  },
  invite: {
    name: 'invite',
    description: 'descActions.invite',
    component: Invite
  },
  addDelation: {
    name: 'addDelation',
    description: 'descActions.addDelation',
    component: AddDelation
  },
  withdraw: {
    name: 'withdraw',
    description: 'descActions.withdraw',
    component: Withdraw
  },
  requestInspection: {
    name: 'requestInspection',
    description: 'descActions.requestInspection',
    component: RequestInspection
  },
  acceptInspection: {
    name: 'acceptInspection',
    description: 'descActions.acceptInspection',
    component: AcceptInspection
  },
  addResearch: {
    name: 'addResearch',
    description: 'descActions.addResearch',
    component: AddResearch
  },
  addResearchValidation: {
    name: 'addResearchValidation',
    description: 'descActions.addResearchValidation',
    component: AddResearchValidation
  },
  addCalculatorItem: {
    name: 'addCalculatorItem',
    description: 'descActions.addCalculatorItem',
    component: AddCalculatorItem
  },
  addReport: {
    name: 'addReport',
    description: 'descActions.addReport',
    component: AddReport
  },
  addReportValidation: {
    name: 'addReportValidation',
    description: 'descActions.addReportValidation',
    component: AddReportValidation
  },
  addContribution: {
    name: 'addContribution',
    description: 'descActions.addContribution',
    component: AddContribution
  },
  offsetting: {
    name: 'offsetting',
    description: 'descActions.offset',
    component: Offsetting
  },
  realizeInspection: {
    name: 'realizeInspection',
    description: 'descActions.realizeInspection',
    component: RealizeInspection
  },
  updateProfilePhoto: {
    name: 'updateProfilePhoto',
    description: 'descActions.updateProfilePhoto',
    component: UpdateProfilePhoto
  },
  declareReduction: {
    name: 'declareReduction',
    description: 'descActions.declareReduction',
    component: DeclareReduction
  }
}

export type ActionsNameType = keyof typeof actionsList
