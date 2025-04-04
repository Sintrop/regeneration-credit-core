/* eslint-disable react-hooks/exhaustive-deps */
import { getImageFromIpfs } from '@renderer/services/ipfs'
import { useEffect, useState } from 'react'

interface Props {
  description?: string
  hashImage?: string
}

export function PublicationContent({ description, hashImage }: Props): JSX.Element {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    handleGetImage()
  }, [hashImage])

  async function handleGetImage(): Promise<void> {
    const response = await getImageFromIpfs(hashImage)
    if (response.success) setImageSrc(response.image)
  }

  return (
    <div className="flex flex-col mt-3">
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
