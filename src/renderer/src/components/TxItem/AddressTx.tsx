import { Jazzicon } from '@ukstv/jazzicon-react'

interface Props {
  address: string
}
export function AddressTx({ address }: Props): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      <Jazzicon className="w-6 h-6" address={address} />
      <p className="text-white max-w-[90%] truncate text-ellipsis">{address}</p>
    </div>
  )
}
