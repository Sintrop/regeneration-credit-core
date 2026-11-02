/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'

import { validationAbi, validationAddress } from '@renderer/services/contracts'
import { UserValidationProps } from '../types'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

interface Props {
  userAddress: string
  era: number
}
interface ReturnUseUserValidationEventProps {
  isLoading: boolean
  validations: UserValidationProps[]
}
export function useUserValidations({ userAddress, era }: Props): ReturnUseUserValidationEventProps {
  const [validations, setValidations] = useState<UserValidationProps[]>([])
  const { rpcUrl } = useSettingsContext()

  useEffect(() => {
    handleGetEvents()
  }, [era])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpcUrl,
      userAddress,
      era
    })

    const newArray: UserValidationProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      newArray.push({
        createdAt: bigNumberToFloat(event?.blockNumber as string),
        justification: event.returnValues._justification as string,
        userAddress: event.returnValues._userAddress as string,
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
  userAddress: string
  era: number
}
async function getPastEvents({
  rpcUrl,
  userAddress,
  era
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = validationAbi
  const contractAddress = validationAddress

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('UserValidation', {
    filter: { _userAddress: userAddress, _currentEra: era },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
