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
}
export function UserTypeActions({ userType, lastPublishedWork }: Props): JSX.Element {
  if (userType === 0) return <div />

  const Actions = userTypeActions[userType as UserTypeActions]

  return <Actions lastPublishedWork={lastPublishedWork} />
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
