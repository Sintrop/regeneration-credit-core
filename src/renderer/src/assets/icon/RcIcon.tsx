import { IconBaseProps } from '@renderer/components/Icon/Icon'
import Image from '../images/rc.png'

export function RcIcon({ size = 20 }: IconBaseProps): JSX.Element {
  return <img src={Image} style={{ width: size, height: size }} className="object-contain" />
}
