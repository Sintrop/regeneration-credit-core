import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { useState } from 'react'

import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { supporterAbi, supporterAddress } from '@renderer/services/contracts'

const INVITER_PERCENTAGE = 5

interface PublishProps {
  description: string
  amountWei: bigint
  image?: string
}

interface ReturnUsePublishProps {
  publish: (data: PublishProps) => void
  isPending: boolean
  isError: boolean
  error?: string
  hash?: `0x${string}`
  uploadingImage: boolean
  uploadedError: boolean
}

export function usePublish(): ReturnUsePublishProps {
  const { ipfsApiUrl } = useSettingsContext()
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedError, setUploadedError] = useState(false)

  async function handlePublish(data: PublishProps): Promise<void> {
    setUploadedError(false)
    const value = data.amountWei
    // SupporterRules.INVITER_PERCENTAGE: at most 5% goes to the inviter, the rest must be burned.
    const minAmmountToBurnParsed = (value * BigInt(100 - INVITER_PERCENTAGE)) / 100n

    let content = ''

    if (data.image) {
      setUploadingImage(true)
      const blobFile = await base64ToBlob(data.image)
      const response = await uploadToIpfs({ file: blobFile, ipfsApiUrl })
      if (response.success) {
        content = response.hash
      } else {
        setUploadedError(true)
        setUploadingImage(false)
        return
      }
      setUploadingImage(false)
    }

    writeContract({
      address: supporterAddress,
      abi: supporterAbi,
      functionName: 'publish',
      args: [value, minAmmountToBurnParsed, data.description, content]
    })
  }

  return {
    isError,
    isPending,
    error: error?.message,
    hash: data,
    publish: handlePublish,
    uploadingImage,
    uploadedError
  }
}
