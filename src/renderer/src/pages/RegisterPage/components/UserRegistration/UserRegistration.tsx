import { ActivistRegistration } from './ActivistRegistration'
import { ContributorRegistration } from './ContributorRegistration'
import { DeveloperRegistration } from './DeveloperRegistration'
import { InspectorRegistration } from './InspectorRegistration'
import { RegeneratorRegistration } from './RegeneratorRegistration'
import { ResearcherRegistration } from './ResearcherRegistration'
import { SupporterRegistration } from './SupporterRegistration'

interface Props {
  userType: RegistrationUserType
  name: string
  requirementsMet: boolean
  success: () => void
}

export function UserRegistration({ userType, name, requirementsMet, success }: Props): JSX.Element {
  const Registration = registrationsUserType[userType]

  return <Registration name={name} requirementsMet={requirementsMet} success={success} />
}

const registrationsUserType = {
  //this user type 0 don't exist
  0: SupporterRegistration,
  1: RegeneratorRegistration,
  2: InspectorRegistration,
  3: ResearcherRegistration,
  4: DeveloperRegistration,
  5: ContributorRegistration,
  6: ActivistRegistration,
  7: SupporterRegistration
}

export type RegistrationUserType = keyof typeof registrationsUserType
