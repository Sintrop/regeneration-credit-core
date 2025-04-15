import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import RcImage from '@renderer/assets/images/rc.png'
import { Img } from 'react-image'

interface Props {
  description?: string
  hashImage?: string
  burnedTokens?: string
}

export function PublicationContent({ description, hashImage, burnedTokens }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col mt-3">
      {burnedTokens && (
        <div className="flex items-center justify-between w-full">
          <p className="text-white font-bold">{t('burnedTokens')}</p>

          <div className="flex items-center gap-1">
            <p className="font-bold text-green-600">
              {Intl.NumberFormat('pt-BR').format(parseFloat(formatUnits(BigInt(burnedTokens), 18)))}
            </p>
            <img src={RcImage} alt="regeneration credit icon" className="w-5 h-5 object-contain" />
          </div>
        </div>
      )}

      {description && <p className="text-white mt-5">{description}</p>}

      {hashImage && (
        <div className="w-full max-h-[400px] rounded-2xl mt-1 bg-container-secondary overflow-hidden">
          <Img src={`https://ipfs.io/ipfs/${hashImage}`} className="w-full h-full object-contain" />
        </div>
      )}
    </div>
  )
}
