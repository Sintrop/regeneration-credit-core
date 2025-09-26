/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { ContributionValidationProps } from '../types'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'

interface Props {
  contributionId: number
}
interface ReturnUseResearchValidationsProps {
  isLoading: boolean
  validations: ContributionValidationProps[]
}
export function useContributionValidations({
  contributionId
}: Props): ReturnUseResearchValidationsProps {
  const mainnet = useMainnet()
  const [validations, setValidations] = useState<ContributionValidationProps[]>([])

  useEffect(() => {
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      mainnet,
      rpcUrl: 'https://sequoiarpc.sintrop.com',
      contributionId
    })

    const newArray: ContributionValidationProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      newArray.push({
        createdAt: bigNumberToFloat(event?.blockNumber as string),
        justification: event.returnValues._justification as string,
        resourceId: contributionId,
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
  contributionId: number
}
async function getPastEvents({
  mainnet,
  rpcUrl,
  contributionId
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = mainnet ? contributorAbi : sequoiaContributorAbi
  const contractAddress = mainnet ? contributorAddress : sequoiaContributorAddress

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('ContributionValidation', {
    filter: { _resourceId: contributionId },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
