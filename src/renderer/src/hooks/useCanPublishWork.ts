import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { useBlockNumber } from 'wagmi'

interface ReturnUseCanPublishWork {
  canPublish: boolean
  canPublishIn: number
  isLoading: boolean
}
interface Props {
  lastPublishedAt?: number
}
export function useCanPublishWork({ lastPublishedAt }: Props): ReturnUseCanPublishWork {
  const { data: responseBlock } = useBlockNumber()
  const blockNumber = responseBlock ? parseInt(formatUnits(BigInt(responseBlock), 0)) : 0

  const [isLoading, setIsLoading] = useState(true)
  const [canPublish, setCanPublish] = useState(false)
  const [canPublishIn, setCanPublishIn] = useState(0)

  useEffect(() => {
    checkCanPublish()

    if (blockNumber === 0) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [blockNumber, lastPublishedAt])

  function checkCanPublish(): void {
    if (lastPublishedAt === 0) {
      setCanPublish(true)
      return
    }
    if (!lastPublishedAt) return
    const timeBetweenWorks = parseInt(import.meta.env.VITE_TIME_BETWEEN_WORKS)
    const canPublishBlock = lastPublishedAt + timeBetweenWorks

    if (canPublishBlock < blockNumber) {
      setCanPublish(true)
    } else {
      setCanPublish(false)
      setCanPublishIn(canPublishBlock - blockNumber)
    }
  }

  return {
    canPublish,
    canPublishIn,
    isLoading
  }
}
