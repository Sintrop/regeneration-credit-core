import { CirclesIcon } from '@renderer/assets/icon/CirclesIcon'
import { ComputerIcon } from '@renderer/assets/icon/ComputerIcon'
import { DashboardIcon } from '@renderer/assets/icon/DashboardIcon'
import { GraphSquareIcon } from '@renderer/assets/icon/GraphSquareIcon'
import { SheetCheckIcon } from '@renderer/assets/icon/SheetCheckIcon'
import { SheetIcon } from '@renderer/assets/icon/SheetIcon'
import { SheetSearchIcon } from '@renderer/assets/icon/SheetSearchIcon'
import { UserCircleIcon } from '@renderer/assets/icon/UserCircleIcon'
import { UserPlusIcon } from '@renderer/assets/icon/UserPlusIcon'
import { UsersIcon } from '@renderer/assets/icon/UsersIcon'

interface Props {
  name: IconName
  size?: number
  color?: string
}

export function Icon({ name, color, size }: Props): JSX.Element {
  const Icon = icons[name]
  return <Icon size={size} color={color} />
}

const icons = {
  circles: CirclesIcon,
  computer: ComputerIcon,
  dashboard: DashboardIcon,
  graphSquare: GraphSquareIcon,
  sheetCheck: SheetCheckIcon,
  sheetSearch: SheetSearchIcon,
  sheet: SheetIcon,
  users: UsersIcon,
  userCircle: UserCircleIcon,
  userPlus: UserPlusIcon
}

export type IconName = keyof typeof icons
export interface IconBaseProps {
  size?: number
  color?: string
}
