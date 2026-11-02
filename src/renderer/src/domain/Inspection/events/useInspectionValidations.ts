/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'

import { inspectionAbi, inspectionAddress } from '@renderer/services/contracts'
import { InspectionValidationProps } from '../types'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

interface Props {
  inspectionId: number
}
interface ReturnUseInspectionValidationsProps {
  isLoading: boolean
  validations: InspectionValidationProps[]
}
export function useInspectionValidations({
  inspectionId
}: Props): ReturnUseInspectionValidationsProps {
  const [validations, setValidations] = useState<InspectionValidationProps[]>([])
  const { rpcUrl } = useSettingsContext()

  useEffect(() => {
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpcUrl,
      inspectionId
    })

    const newArray: InspectionValidationProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      newArray.push({
        createdAt: bigNumberToFloat(event?.blockNumber as string),
        justification: event.returnValues._justification as string,
        resourceId: inspectionId,
        validatorAddress: event.returnValues._validatorAddress as string
      })
    }

    setValidations(newArray)
  }

  return {
    isLoading: false,
    validations
  }
}

interface GetPastEventsProps {
  rpcUrl: string
  inspectionId: number
}
async function getPastEvents({ rpcUrl, inspectionId }: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = inspectionAbi
  const contractAddress = inspectionAddress

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('InspectionValidation', {
    filter: { _resourceId: inspectionId },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
