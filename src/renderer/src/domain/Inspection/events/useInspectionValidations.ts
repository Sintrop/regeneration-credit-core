/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'

import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { InspectionValidationProps } from '../types'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'

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
  const mainnet = useMainnet()
  const [validations, setValidations] = useState<InspectionValidationProps[]>([])

  useEffect(() => {
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      mainnet,
      rpcUrl: 'https://sequoiarpc.sintrop.com',
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
  mainnet: boolean
  rpcUrl: string
  inspectionId: number
}
async function getPastEvents({
  mainnet,
  rpcUrl,
  inspectionId
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = mainnet ? inspectionAbi : sequoiaInspectionAbi
  const contractAddress = mainnet ? inspectionAddress : sequoiaInspectionAddress

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('InspectionValidation', {
    filter: { _resourceId: inspectionId },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
