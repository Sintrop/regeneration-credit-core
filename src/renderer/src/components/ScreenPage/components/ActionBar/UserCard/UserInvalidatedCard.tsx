import { useAccount } from 'wagmi'
import { BasicData } from './BasicData'

export function UserInvalidatedCard(): JSX.Element {
  const { address } = useAccount()

  return <BasicData address={address ? address : ''} name="userInvalidated" photoHash="" />
}
