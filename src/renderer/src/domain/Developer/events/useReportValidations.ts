/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { ReportValidationProps } from '../types'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

interface Props {
  reportId: number
}
interface ReturnUseResearchValidationsProps {
  isLoading: boolean
  validations: ReportValidationProps[]
}
export function useReportValidations({ reportId }: Props): ReturnUseResearchValidationsProps {
  const mainnet = useMainnet()
  const [validations, setValidations] = useState<ReportValidationProps[]>([])
  const { rpcUrl, sequoiaRpcUrl } = useSettingsContext()

  useEffect(() => {
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      mainnet,
      rpcUrl: mainnet ? rpcUrl : sequoiaRpcUrl,
      reportId
    })

    const newArray: ReportValidationProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      newArray.push({
        createdAt: bigNumberToFloat(event?.blockNumber as string),
        justification: event.returnValues._justification as string,
        resourceId: reportId,
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
  reportId: number
}
async function getPastEvents({
  mainnet,
  rpcUrl,
  reportId
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = mainnet ? developerAbi : sequoiaDeveloperAbi
  const contractAddress = mainnet ? developerAddress : sequoiaDeveloperAddress

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('ReportValidation', {
    filter: { _resourceId: reportId },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
