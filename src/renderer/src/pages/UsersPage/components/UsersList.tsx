import { Inspectors } from './Inspectors/Inspectors'
import { Regenerators } from './Regenerators/Regenerators'

interface Props {
  userType: number
  idsList: number[]
}

export function UsersList({ idsList, userType }: Props): JSX.Element {
  const List = userTypeToList[userType as UserTypeToListType]

  return <List idsList={idsList} />
}

const userTypeToList = {
  1: Regenerators,
  2: Inspectors
}

type UserTypeToListType = keyof typeof userTypeToList
