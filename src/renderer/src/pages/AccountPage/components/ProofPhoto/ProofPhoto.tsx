import { Jazzicon } from '@ukstv/jazzicon-react'
import { Img } from 'react-image'

interface Props {
  address: string
  hash?: string
}

export function ProofPhoto({ address, hash }: Props): JSX.Element {
  return (
    <div className="relative w-20 h-20 rounded-full">
      <Jazzicon className="w-20 h-20 z-0" address={address as string} />
      {hash && (
        <Img
          src={`https://ipfs.io/ipfs/${hash}`}
          className="w-full h-full rounded-full object-cover absolute top-0 left-0 z-10"
        />
      )}
    </div>
  )
}
