import { useTranslation } from 'react-i18next'
import { BiSolidMegaphone } from 'react-icons/bi'
import { FaRegEye } from 'react-icons/fa'
import { MdTouchApp } from 'react-icons/md'

const subtitlesAvailable = {
  acceptInspection: {
    label: 'subtitles.acceptInspection',
    icon: MdTouchApp
  },
  seeContent: {
    label: 'subtitles.seeContent',
    icon: FaRegEye
  },
  vote: {
    label: 'subtitles.voteToInvalidate',
    icon: BiSolidMegaphone
  }
}
type SubtitlesName = keyof typeof subtitlesAvailable

interface Props {
  subtitles: SubtitlesName[]
}
export function Subtitles({ subtitles }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-container-primary p-3">
      {subtitles.map((item, index) => {
        const Component = subtitlesAvailable[item]

        return (
          <div key={index} className="flex items-center gap-2">
            <Component.icon color="white" />
            <p className="text-white text-xs">{t(Component.label)}</p>
          </div>
        )
      })}
    </div>
  )
}
