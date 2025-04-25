import CircleImage from '@renderer/assets/images/circle.png'
import { useTranslation } from 'react-i18next'

interface Props {
  userType: number
  indicator: number
}

export function CentralIndicator({ userType, indicator }: Props): JSX.Element {
  const { t } = useTranslation()

  const label = userTypeToLabel[userType]

  return (
    <div className="flex flex-col">
      <div className="w-32 h-32 bg-green-secondary p-3 flex items-center justify-center rounded-full mt-[-30px] relative">
        <img src={CircleImage} className="w-full h-full rounded-full object-contain" />
        <p className="font-bold text-green-btn text-4xl absolute">{indicator}</p>
      </div>
      <p className="text-sm text-white text-center">{t(label)}</p>
    </div>
  )
}

const userTypeToLabel = {
  1: 'regenerationScore',
  2: 'yourLevel',
  3: 'publishedResearches',
  4: 'yourLevel',
  5: 'yourLevel',
  6: 'yourLevel',
  7: 'offsets',
  9: ''
}
