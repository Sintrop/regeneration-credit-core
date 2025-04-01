import { ActivistData } from './ActivistData/ActivistData'
import { ContributorData } from './ContributorData/ContributorData'
import { DeveloperData } from './DeveloperData/DeveloperData'
import { InspectorData } from './InspectorData/InspectorData'
import { RegeneratorData } from './RegeneratorData/RegeneratorData'
import { ResearcherData } from './ResearcherData/ResearcherData'
import { SupporterData } from './SupporterData/SupporterData'
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
  1: RegeneratorData,
  2: InspectorData,
  3: ResearcherData,
  4: DeveloperData,
  5: ContributorData,
  6: ActivistData,
  7: SupporterData
}

export type UserTypeAvailables = keyof typeof userTypeAvailable
