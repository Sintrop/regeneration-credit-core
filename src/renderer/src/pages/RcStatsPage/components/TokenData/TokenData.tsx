import {
  rcAbi,
  rcAddress,
  sequoiaRcAbi,
  sequoiaRcAddress,
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContracts } from 'wagmi'
import { StatsRcItem } from '../StatsRcItem'
import { Loading } from '@renderer/components/Loading/Loading'

export function TokenData(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const rcContract = {
    address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
    abi: chainId === 250225 ? rcAbi : sequoiaRcAbi
  } as const

  const userContract = {
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi
  } as const

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        ...rcContract,
        functionName: 'totalSupply',
        args: []
      },
      {
        ...rcContract,
        functionName: 'totalLocked',
        args: []
      },
      {
        ...rcContract,
        functionName: 'totalCertified',
        args: []
      },
      {
        ...userContract,
        functionName: 'usersCount',
        args: []
      }
    ]
  })

  let totalSupply = 0
  let totalLocked = 0
  let totalCertified = 0
  let totalUsers = 0

  if (data) {
    const _totalSupply = data[0].status === 'success' ? (data[0]?.result as string) : '0'
    totalSupply = parseFloat(formatUnits(BigInt(_totalSupply), 18))

    const _totalLocked = data[1].status === 'success' ? (data[1]?.result as string) : '0'
    totalLocked = parseFloat(formatUnits(BigInt(_totalLocked), 18))

    const _totalCertified = data[2].status === 'success' ? (data[2]?.result as string) : '0'
    totalCertified = parseFloat(formatUnits(BigInt(_totalCertified), 18))

    const _totalUsers = data[3].status === 'success' ? (data[3]?.result as string) : '0'
    totalUsers = parseFloat(formatUnits(BigInt(_totalUsers), 0))
  }

  return (
    <div className="flex flex-col">
      <p className="text-white mb-2">{t('tokenData')}</p>

      {isLoading ? (
        <div className="mx-auto overflow-hidden">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-wrap gap-5">
          <StatsRcItem
            title={t('totalSupply')}
            value={Intl.NumberFormat('pt-BR').format(totalSupply)}
            suffix="RC"
          />
          <StatsRcItem
            title={t('totalLocked')}
            value={Intl.NumberFormat('pt-BR').format(totalLocked)}
            suffix="RC"
          />
          <StatsRcItem
            title={t('totalCertified')}
            value={Intl.NumberFormat('pt-BR').format(totalCertified)}
            suffix="RC"
          />
          <StatsRcItem
            title={t('totalUsers')}
            value={Intl.NumberFormat('pt-BR').format(totalUsers)}
          />
        </div>
      )}
    </div>
  )
}
