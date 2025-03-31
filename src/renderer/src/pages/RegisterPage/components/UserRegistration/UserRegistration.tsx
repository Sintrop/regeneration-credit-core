import { InspectorRegistration } from './InspectorRegistration'

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
  7: InspectorRegistration
}

export type RegistrationUserType = keyof typeof registrationsUserType
