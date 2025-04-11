/* eslint-disable react-hooks/exhaustive-deps */
import { getImageFromIpfs } from '@renderer/services/ipfs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import RcImage from '@renderer/assets/images/rc.png'

interface Props {
  description?: string
  hashImage?: string
  burnedTokens?: string
}

export function PublicationContent({ description, hashImage, burnedTokens }: Props): JSX.Element {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    handleGetImage()
  }, [hashImage])

  async function handleGetImage(): Promise<void> {
    const response = await getImageFromIpfs(hashImage)
    if (response.success) setImageSrc(response.image)
  }

  return (
    <div className="flex flex-col mt-3">
      {burnedTokens && (
        <div className="flex items-center gap-1">
          <p className="text-white">
            {t('burnedTokens')}:{' '}
            {Intl.NumberFormat('pt-BR').format(parseFloat(formatUnits(BigInt(burnedTokens), 18)))}
          </p>

          <img src={RcImage} alt="regeneration credit icon" className="w-5 h-5 object-contain" />
        </div>
      )}

      {description && <p className="text-white">{description}</p>}

      {imageSrc && (
        <div className="w-full h-[400px] rounded-2xl mt-1 bg-container-secondary">
          <img
            src={imageSrc}
            alt="Publication"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      )}
    </div>
  )
}
