import { DeveloperData } from './DeveloperData/DeveloperData'
import { UserType0Data } from './UserType0Data'

interface Props {
  userType: UserTypeAvailables
}

export function UserTypeContent({ userType }: Props): JSX.Element {
  const UserContentData = userTypeAvailable[userType]

  return <UserContentData />
}

const userTypeAvailable = {
  0: UserType0Data,
  4: DeveloperData
}

export type UserTypeAvailables = keyof typeof userTypeAvailable
