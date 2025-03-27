import { DeveloperData } from './DeveloperData/DeveloperData'

interface Props {
  userType: UserTypeAvailables
}

export function UserTypeContent({ userType }: Props): JSX.Element {
  const UserContentData = userTypeAvailable[userType]

  return <UserContentData />
}

const userTypeAvailable = {
  4: DeveloperData
}

export type UserTypeAvailables = keyof typeof userTypeAvailable
