import { DeveloperData } from './DeveloperData/DeveloperData'
import { InspectorData } from './InspectorData/InspectorData'
import { RegeneratorData } from './RegeneratorData/RegeneratorData'
import { UserType0Data } from './UserType0Data'
import { WithoutContent } from './WithoutContent'

interface Props {
  userType: UserTypeAvailables
}

export function UserTypeContent({ userType }: Props): JSX.Element {
  const UserContentData = userTypeAvailable[userType]

  return <UserContentData />
}

const userTypeAvailable = {
  0: UserType0Data,
  1: RegeneratorData,
  2: InspectorData,
  3: WithoutContent,
  4: DeveloperData,
  5: WithoutContent,
  6: WithoutContent,
  7: WithoutContent
}

export type UserTypeAvailables = keyof typeof userTypeAvailable
