import { BurnTokens } from './actions/burnTokens'

export const actionsList = {
  burnTokens: {
    name: 'burnTokens',
    description: 'shortDescriptionBurntokens',
    component: BurnTokens
  }
}

export type ActionsNameType = keyof typeof actionsList
