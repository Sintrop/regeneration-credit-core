import { IconBaseProps } from '@renderer/components/Icon/Icon'
import Dashboard from './dashboard.png'

export function DashboardIcon({ size = 20 }: IconBaseProps): JSX.Element {
  return <img src={Dashboard} style={{ width: size, height: size }} className="object-contain" />
}
