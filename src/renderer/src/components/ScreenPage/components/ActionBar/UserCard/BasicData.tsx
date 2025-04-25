import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { Img } from 'react-image'
import { useNavigate } from 'react-router-dom'

interface Props {
  address: string
  name: string
  photoHash: string
}

export function BasicData({ address, name, photoHash }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleGoToAccount(): void {
    navigate('/account')
  }

  return (
    <div className="flex gap-5">
      <div className="relative w-[70px] h-[70px] overflow-hidden">
        <Jazzicon address={address} className="w-full h-full z-30" />
        {photoHash !== '' && (
          <Img
            src={`https://ipfs.io/ipfs/${photoHash}`}
            className="absolute w-full h-full rounded-full top-0 left-0 object-cover z-40"
          />
        )}
      </div>

      <button
        className="flex flex-col gap-1 items-start group hover:cursor-pointer"
        onClick={handleGoToAccount}
      >
        <p className="font-semibold text-white group-hover:underline">{name}</p>
        <p className="text-white truncate text-ellipsis max-w-[70%] group-hover:underline">
          {address}
        </p>
        <p className="text-gray-300 text-sm">{t('developer')}</p>
      </button>
    </div>
  )
}
