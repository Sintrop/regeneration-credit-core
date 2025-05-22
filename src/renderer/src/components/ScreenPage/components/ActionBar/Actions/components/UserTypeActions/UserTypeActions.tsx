import { RegeneratorActions } from './RegeneratorActions'
import { InspectorActions } from './InspectorActions'
import { ResearcherActions } from './ResearcherActions'
import { DeveloperActions } from './DeveloperActions'
import { ContributorActions } from './ContributorActions'
import { ActivistActions } from './ActivistActions'
import { SupporterActions } from './SupporterActions'

interface Props {
  userType: number
  lastPublishedWork: number
  mainAction?: boolean
}
export function UserTypeActions({ userType, lastPublishedWork, mainAction }: Props): JSX.Element {
  if (userType === 0 || userType === 8) return <div />

  const Actions = userTypeActions[userType as UserTypeActions]

  return <Actions lastPublishedWork={lastPublishedWork} mainAction={mainAction} />
}

const userTypeActions = {
  1: RegeneratorActions,
  2: InspectorActions,
  3: ResearcherActions,
  4: DeveloperActions,
  5: ContributorActions,
  6: ActivistActions,
  7: SupporterActions
}
type UserTypeActions = keyof typeof userTypeActions
