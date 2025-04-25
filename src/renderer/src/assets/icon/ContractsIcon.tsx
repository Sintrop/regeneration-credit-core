import { IconBaseProps } from '@renderer/components/Icon/Icon'
import Contracts from './contracts.png'

export function ContractsIcon({ size = 20 }: IconBaseProps): JSX.Element {
  return <img src={Contracts} style={{ width: size, height: size }} className="object-contain" />
}
