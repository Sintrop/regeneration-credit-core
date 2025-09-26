/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { ResearchValidationProps } from '../types'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'

interface Props {
  researchId: number
}
interface ReturnUseResearchValidationsProps {
  isLoading: boolean
  validations: ResearchValidationProps[]
}
export function useResearchValidations({ researchId }: Props): ReturnUseResearchValidationsProps {
  const mainnet = useMainnet()
  const [validations, setValidations] = useState<ResearchValidationProps[]>([])

  useEffect(() => {
    setValidations([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      mainnet,
      rpcUrl: 'https://sequoiarpc.sintrop.com',
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
  mainnet: boolean
  rpcUrl: string
  researchId: number
}
async function getPastEvents({
  mainnet,
  rpcUrl,
  researchId
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = mainnet ? researcherAbi : sequoiaResearcherAbi
  const contractAddress = mainnet ? researcherAddress : sequoiaResearcherAddress

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('ResearchValidation', {
    filter: { _resourceId: researchId },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
