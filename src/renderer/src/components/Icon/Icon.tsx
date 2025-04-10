import { CirclesIcon } from '@renderer/assets/icon/CirclesIcon'

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
  circles: CirclesIcon
}

export type IconName = keyof typeof icons
export interface IconBaseProps {
  size?: number
  color?: string
}
