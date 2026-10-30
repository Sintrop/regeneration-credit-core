import { useReadContract } from 'wagmi'
import { supporterAbi, supporterAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { SupporterProps } from '@renderer/types/supporter'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'

interface Props {
  id: number
}

export function SupporterItem({ id }: Props): JSX.Element {
  const { data } = useReadContract({
    address: supporterAddress,
    abi: supporterAbi,
    functionName: 'supportersAddress',
    args: [id]
  })

  const userSUpporterAddress = data as string

  const { data: supporterResponse } = useReadContract({
    address: supporterAddress,
    abi: supporterAbi,
    functionName: 'getSupporter',
    args: [userSUpporterAddress]
  })

  const supporter = supporterResponse as SupporterProps

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">
        {supporter && <UserAddressLink address={supporter?.supporterWallet} />}
      </td>
      <td className="p-2">{supporter && supporter?.name}</td>
      <td className="p-2">{supporter && formatUnits(BigInt(supporter?.createdAt), 0)}</td>
      <td className="p-2"></td>
    </tr>
  )
}
