import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { userTypeToName, UserTypeToNameType } from '@renderer/types/user'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useChainId, useReadContract } from 'wagmi'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { UsersList } from './components/UsersList'
import { Loading } from '@renderer/components/Loading/Loading'

export function UsersPage(): JSX.Element {
  const { t } = useTranslation()
  const params = useParams()
  const userType = parseInt(params?.userType as string) as UserTypeToNameType
  const nameFromUserType = userTypeToName[userType]

  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'userTypesTotalCount',
    args: [userType]
  })

  let usersIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    usersIds = ids.reverse()
  }

  return (
    <ScreenPage pageTitle={t(nameFromUserType)}>
      {isLoading ? (
        <div className="mx-auto mt-10 overflow-hidden">
          <Loading />
        </div>
      ) : (
        <UsersList idsList={usersIds} userType={userType} />
      )}
    </ScreenPage>
  )
}
