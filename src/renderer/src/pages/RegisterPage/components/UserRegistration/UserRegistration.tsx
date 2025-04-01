import { ActivistRegistration } from './ActivistRegistration'
import { ContributorRegistration } from './ContributorRegistration'
import { DeveloperRegistration } from './DeveloperRegistration'
import { InspectorRegistration } from './InspectorRegistration'
import { ResearcherRegistration } from './ResearcherRegistration'
import { SupporterRegistration } from './SupporterRegistration'

interface Props {
  userType: RegistrationUserType
  name: string
}

export function UserRegistration({ userType, name }: Props): JSX.Element {
  const Registration = registrationsUserType[userType]

  return <Registration name={name} />
}

const registrationsUserType = {
  2: InspectorRegistration,
  3: ResearcherRegistration,
  4: DeveloperRegistration,
  5: ContributorRegistration,
  6: ActivistRegistration,
  7: SupporterRegistration
}

export type RegistrationUserType = keyof typeof registrationsUserType
