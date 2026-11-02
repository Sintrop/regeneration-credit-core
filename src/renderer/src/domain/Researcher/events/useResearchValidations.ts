/* eslint-disable @typescript-eslint/ban-ts-comment */
import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { ResearchValidationProps } from '../types'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

interface Props {
  researchId: number
}
interface ReturnUseResearchValidationsProps {
  isLoading: boolean
  validations: ResearchValidationProps[]
}
export function useResearchValidations({ researchId }: Props): ReturnUseResearchValidationsProps {
  const [validations, setValidations] = useState<ResearchValidationProps[]>([])
  const { rpcUrl } = useSettingsContext()

  useEffect(() => {
    setValidations([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpcUrl,
      researchId
    })

    const newArray: ResearchValidationProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      newArray.push({
        createdAt: bigNumberToFloat(event?.blockNumber as string),
        justification: event.returnValues._justification as string,
        resourceId: researchId,
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
  researchId: number
}
async function getPastEvents({ rpcUrl, researchId }: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = researcherAbi
  const contractAddress = researcherAddress

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('ResearchValidation', {
    filter: { _resourceId: researchId },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
