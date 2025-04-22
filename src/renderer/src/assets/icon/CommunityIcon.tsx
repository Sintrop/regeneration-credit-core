import { IconBaseProps } from '@renderer/components/Icon/Icon'
import Community from './community.png'

export function CommunityIcon({ size = 20 }: IconBaseProps): JSX.Element {
  return <img src={Community} style={{ width: size, height: size }} className="object-contain" />
}
