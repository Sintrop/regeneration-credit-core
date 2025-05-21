import {
  sequoiaValidationAbi,
  sequoiaValidationAddress,
  validationAbi,
  validationAddress
} from '@renderer/services/contracts'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useEffect, useState } from 'react'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  resourceId: number
  validationId: number
  resourceType: 'report' | 'contribution' | 'inspection' | 'research'
}

export function ResourceValidationFeedItem({
  resourceId,
  resourceType,
  validationId
}: Props): JSX.Element {
  const [functionName, setFunctionName] = useState('')

  useEffect(() => {
    if (resourceType === 'report') {
      setFunctionName('reportValidations')
    }
    if (resourceType === 'contribution') {
      setFunctionName('contributionValidations')
    }
    if (resourceType === 'research') {
      setFunctionName('researchValidations')
    }
    if (resourceType === 'inspection') {
      setFunctionName('inspectionValidations')
    }
  }, [])

  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? validationAddress : sequoiaValidationAddress,
    abi: chainId === 250225 ? validationAbi : sequoiaValidationAbi,
    functionName,
    args: [resourceId, validationId]
  })

  if (!data) return <div/>

  return (
    <button className="flex gap-3 hover:cursor-pointer">
      <Jazzicon className="w-7 h-7" address={data[0]}/>

      <div className="flex flex-col max-w-[90%] items-start">
        <p className="text-xs text-white truncate text-ellipsis font-semibold">{data[0]}</p>
        <p className="text-xs text-white">{data[2]}</p>
      </div>
    </button>
  )
}
