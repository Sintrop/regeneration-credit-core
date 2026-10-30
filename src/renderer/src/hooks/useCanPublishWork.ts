import { useProtocolRules } from '@renderer/hooks/useProtocolRules'
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
  const { rules } = useProtocolRules()
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
  }, [blockNumber, lastPublishedAt, rules])

  function checkCanPublish(): void {
    if (lastPublishedAt === 0) {
      setCanPublish(true)
      return
    }
    if (!lastPublishedAt || !rules) return
    const timeBetweenWorks = rules.timeBetweenWorks
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
