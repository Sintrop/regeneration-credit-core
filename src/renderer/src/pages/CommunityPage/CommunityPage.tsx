import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContracts } from 'wagmi'
import { UserCountCard } from './components/UserCountCard'
import { formatUnits } from 'viem'
import { Loading } from '@renderer/components/Loading/Loading'

export function CommunityPage(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const communityContract = {
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi
  } as const

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        ...communityContract,
        functionName: 'usersCount'
      },
      {
        ...communityContract,
        functionName: 'userTypesCount',
        args: [1]
      },
      {
        ...communityContract,
        functionName: 'userTypesCount',
        args: [2]
      },
      {
        ...communityContract,
        functionName: 'userTypesCount',
        args: [3]
      },
      {
        ...communityContract,
        functionName: 'userTypesCount',
        args: [4]
      },
      {
        ...communityContract,
        functionName: 'userTypesCount',
        args: [5]
      },
      {
        ...communityContract,
        functionName: 'userTypesCount',
        args: [6]
      },
      {
        ...communityContract,
        functionName: 'userTypesCount',
        args: [7]
      }
    ]
  })

  if (isLoading) {
    return (
      <ScreenPage pageTitle={t('community')}>
        <div className="mx-auto overflow-hidden">
          <Loading />
        </div>
      </ScreenPage>
    )
  }

  if (!data) {
    return (
      <ScreenPage pageTitle={t('community')}>
        <div className="mx-auto overflow-hidden">
          <p className="text-white">error</p>
        </div>
      </ScreenPage>
    )
  }

  return (
    <ScreenPage pageTitle={t('community')}>
      <div className="flex gap-10 flex-wrap max-w-[1024px]">
        <UserCountCard
          user="all-users"
          userType={0}
          usersCount={
            data[0].status === 'success'
              ? parseInt(formatUnits(BigInt(data[0].result as string), 0))
              : 0
          }
        />

        <div className="bg-container-primary p-3 rounded-2xl h-32 flex-1 flex items-center justify-between">
          <p className="text-white">
            A comunidade do Crédito de Regeneração é composta por esses 7 grupos. Para se candidatar
            a algum usuário, conecte sua carteira e preencha os campos necessários. A quantidade de
            vagas de cada tipo específico é proporcional a quantidade de produtores cadastrados,
            obedecendo a proporção.
          </p>
        </div>
      </div>

      <div className="flex gap-10 flex-wrap max-w-[1024px] mt-5">
        <UserCountCard
          user="regenerator"
          userType={1}
          usersCount={
            data[1].status === 'success'
              ? parseInt(formatUnits(BigInt(data[1].result as string), 0))
              : 0
          }
        />

        <UserCountCard
          user="supporter"
          userType={7}
          usersCount={
            data[7].status === 'success'
              ? parseInt(formatUnits(BigInt(data[7].result as string), 0))
              : 0
          }
        />
      </div>

      <div className="flex gap-10 flex-wrap max-w-[1024px] pb-20 mt-5">
        <UserCountCard
          user="other-users"
          userType={2}
          usersCount={
            data[2].status === 'success'
              ? parseInt(formatUnits(BigInt(data[2].result as string), 0))
              : 0
          }
        />

        <UserCountCard
          user="other-users"
          userType={3}
          usersCount={
            data[3].status === 'success'
              ? parseInt(formatUnits(BigInt(data[3].result as string), 0))
              : 0
          }
        />

        <UserCountCard
          user="other-users"
          userType={4}
          usersCount={
            data[4].status === 'success'
              ? parseInt(formatUnits(BigInt(data[4].result as string), 0))
              : 0
          }
        />

        <UserCountCard
          user="other-users"
          userType={5}
          usersCount={
            data[5].status === 'success'
              ? parseInt(formatUnits(BigInt(data[5].result as string), 0))
              : 0
          }
        />

        <UserCountCard
          user="other-users"
          userType={6}
          usersCount={
            data[6].status === 'success'
              ? parseInt(formatUnits(BigInt(data[6].result as string), 0))
              : 0
          }
        />
      </div>
    </ScreenPage>
  )
}
