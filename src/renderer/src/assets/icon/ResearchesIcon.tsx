import { IconBaseProps } from '@renderer/components/Icon/Icon'
import Image from './researches.png'

export function ResearchesIcon({ size = 20 }: IconBaseProps): JSX.Element {
  return <img src={Image} style={{ width: size, height: size }} className="object-contain" />
}
