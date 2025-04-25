import { IconBaseProps } from '@renderer/components/Icon/Icon'
import Image from './my-tokens.png'

export function MyTokensIcon({ size = 20 }: IconBaseProps): JSX.Element {
  return <img src={Image} style={{ width: size, height: size }} className="object-contain" />
}
