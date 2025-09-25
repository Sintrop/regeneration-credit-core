import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaResearcherAbi,
  sequoiaResearcherAddress,
  sequoiaUserAbi,
  sequoiaUserAddress
} from '@renderer/services/contracts'
import { useEffect } from 'react'
import Web3, { EventLog } from 'web3'

interface Props {
  userAddress: string
}

interface ReturnUseUserEventsProps {
  isLoading: boolean
}

export function useUserEvents({}: Props): ReturnUseUserEventsProps {
  const mainnet = useMainnet()
  useEffect(() => {
    getPastEvents()
  }, [])
  return {
    isLoading: false
  }
}

async function getPastEvents(): Promise<EventLog[]> {
  const web3 = new Web3('https://sequoiarpc.sintrop.com')
  const contract = new web3.eth.Contract(sequoiaResearcherAbi, sequoiaResearcherAddress)

  const events = await contract.getPastEvents('ResearchValidation', {
    filter: { _resourceId: '4' },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
