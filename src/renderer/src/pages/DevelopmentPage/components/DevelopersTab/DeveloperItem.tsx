import { useChainId, useReadContract } from 'wagmi'
import { DeveloperProps } from '@renderer/types/developer'
import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'

interface Props {
  id: number
}

export function DeveloperItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'developersAddress',
    args: [id]
  })

  const userDeveloperAddress = data as string

  const { data: developerResponse } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getDeveloper',
    args: [userDeveloperAddress]
  })

  const developer = developerResponse as DeveloperProps

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2 max-w-[100px]">
        {developer && <UserAddressLink address={developer?.developerWallet} />}
      </td>
      <td className="p-2">{developer && developer?.name}</td>
      <td className="p-2">{developer && formatUnits(BigInt(developer?.createdAt), 0)}</td>
      <td className="p-2">{developer && formatUnits(BigInt(developer?.totalReports), 0)}</td>
      <td className="p-2">{developer && formatUnits(BigInt(developer?.pool?.level), 0)}</td>
      <td className="p-2"></td>
    </tr>
  )
}
