/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaValidationAbi,
  sequoiaValidationAddress,
  validationAbi,
  validationAddress
} from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { UserValidationProps } from '../types'

interface Props {
  userAddress: string
}
interface ReturnUseUserValidationEventProps {
  isLoading: boolean
}
export function useUserValidationEvents({ userAddress }: Props): ReturnUseUserValidationEventProps {
  const mainnet = useMainnet()
  const [events, setEvents] = useState<UserValidationProps[]>([])

  useEffect(() => {
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      mainnet,
      rpcUrl: 'https://sequoiarpc.sintrop.com',
      userAddress
    })
    console.log(response)
  }

  return {
    isLoading: false
  }
}

interface GetPastEventsProps {
  mainnet: boolean
  rpcUrl: string
  userAddress: string
}
async function getPastEvents({
  mainnet,
  rpcUrl,
  userAddress
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = mainnet ? validationAbi : sequoiaValidationAbi
  const contractAddress = mainnet ? validationAddress : sequoiaValidationAddress

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('UserValidation', {
    filter: { _userAddress: userAddress },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
