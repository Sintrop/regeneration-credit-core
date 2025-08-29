import { useState } from 'react'
import { parseEther } from 'viem'
import { useWriteContract } from 'wagmi'

import { useMainnet } from '@renderer/hooks/useMainnet'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'

interface PublishProps {
  description: string
  ammount: number
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
  const mainnet = useMainnet()
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedError, setUploadedError] = useState(false)

  async function handlePublish(data: PublishProps): Promise<void> {
    setUploadedError(false)
    const commissionPercentage = parseInt(import.meta.env.VITE_COMMISSION_PERCENTAGE)
    const value = parseEther(data.ammount.toString())

    const minAmmountToBurn = data.ammount * (1 - commissionPercentage / 100)
    const minAmmountToBurnParsed = parseEther(minAmmountToBurn.toString())

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
      address: mainnet ? supporterAddress : sequoiaSupporterAddress,
      abi: mainnet ? supporterAbi : sequoiaSupporterAbi,
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
