import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { Img } from 'react-image'
import { useNavigate } from 'react-router-dom'
import CircleImage from '@renderer/assets/images/circle.png'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

interface Props {
  address: string
  name: string
  photoHash: string
  userTypeName: string
  indicator: number
}

export function BasicData({
  address,
  name,
  photoHash,
  userTypeName,
  indicator
}: Props): JSX.Element {
  const { ipfsGatewayURL } = useSettingsContext()
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
            src={`${ipfsGatewayURL}/ipfs/${photoHash}`}
            className="absolute w-full h-full rounded-full top-0 left-0 object-cover z-40"
          />
        )}
      </div>

      <button
        className="flex flex-col items-start group hover:cursor-pointer w-[250px]"
        onClick={handleGoToAccount}
      >
        <p className="font-semibold text-white group-hover:underline">{name}</p>
        <p className="text-white truncate text-ellipsis max-w-[90%] group-hover:underline">
          {address}
        </p>
        <p className="text-gray-300 text-sm">{t(userTypeName)}</p>
      </button>

      <div className="flex flex-col mr-5">
        <div className="w-[60px] h-[60px] flex items-center justify-center relative">
          <img src={CircleImage} className="w-full h-full rounded-full object-contain" />
          <p className="font-bold text-green-btn absolute">{indicator}</p>
        </div>
        <p className="text-[10px] text-white text-center">{t('actionBar.yourLevel')}</p>
      </div>
    </div>
  )
}
