import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { Img } from 'react-image'

interface Props {
  address: string
  hash?: string
}

export function ProofPhoto({ address, hash }: Props): JSX.Element {
  const { ipfsGatewayURL } = useSettingsContext()

  return (
    <div className="relative w-26 h-26 rounded-full border-3 border-white">
      <Jazzicon className="w-full h-full z-0" address={address as string} />
      {hash && (
        <Img
          src={`${ipfsGatewayURL}/ipfs/${hash}`}
          className="w-full h-full rounded-full object-cover absolute top-0 left-0 z-10"
        />
      )}
    </div>
  )
}
