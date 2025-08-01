import { checkVacancies } from '@renderer/services/checkVacancies'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  user: 'regenerator' | 'supporter' | 'other-users' | 'all-users'
  userType: UserTypesToData
  usersCount: number
}

export function UserCountCard({ user, userType, usersCount }: Props): JSX.Element {
  const { t } = useTranslation()
  const cardData = dataByUserType[userType]
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'userTypesCount',
    args: [1]
  })

  let vacancies: number = 0

  if (data) {
    const producersCount = parseInt(formatUnits(BigInt(data as string), 0))
    const response = checkVacancies({ producersCount, userType, userTypeCount: usersCount })
    vacancies = response.ammount
  }

  return (
    <CardContainer
      usersCount={usersCount}
      user={user}
      label={t(cardData?.label)}
      txtBtnSee={cardData?.txtBtnSee}
      userType={userType}
      vacancies={vacancies}
    />
  )
}

interface CardContainerProps {
  label: string
  usersCount: number
  user: 'regenerator' | 'supporter' | 'other-users' | 'all-users'
  txtBtnSee: string
  userType: number
  vacancies: number
}
function CardContainer({
  user,
  label,
  usersCount,
  txtBtnSee,
  userType,
  vacancies
}: CardContainerProps): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()

  function handleGoToUsers(): void {
    navigate(`/users/${userType}`)
  }

  if (user === 'regenerator' || user === 'supporter' || user === 'all-users') {
    return (
      <div className="bg-container-primary p-3 rounded-2xl h-32 flex-1 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-white text-xl">{label}</h3>
          {txtBtnSee !== '' && (
            <button
              className="text-white font-semibold rounded-2xl text-sm h-8 px-5 bg-blue-primary hover:cursor-pointer"
              onClick={handleGoToUsers}
            >
              {t(txtBtnSee)}
            </button>
          )}
        </div>

        <div className="w-20 h-20 bg-container-secondary rounded-2xl flex items-center justify-center">
          <p className="font-bold text-white text-4xl">{usersCount}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-container-primary py-3 rounded-2xl w-[200px] flex flex-col items-center">
      <h3 className="font-bold text-white text-xl">{label}</h3>

      <div className="w-full mt-10 px-3 gap-3 flex flex-col">
        <div className="w-full h-10 flex items-center justify-between bg-container-secondary rounded-2xl px-2">
          <p className="text-white">{t('community.registered')}</p>
          <p className="font-bold text-green-500">{usersCount}</p>
        </div>

        <div className="w-full h-10 flex items-center justify-between bg-container-secondary rounded-2xl px-2">
          <p className="text-white">{t('community.vacancies')}</p>
          <p className="font-bold text-green-500">{vacancies}</p>
        </div>

        <button
          className="text-white font-semibold rounded-2xl text-sm h-8 w-full bg-blue-primary hover:cursor-pointer"
          onClick={handleGoToUsers}
        >
          {t(txtBtnSee)}
        </button>
      </div>
    </div>
  )
}

const dataByUserType = {
  0: {
    label: 'community.allUsers',
    txtBtnSee: ''
  },
  1: {
    label: 'community.regenerators',
    txtBtnSee: 'community.seeRegenerators'
  },
  2: {
    label: 'community.inspectors',
    txtBtnSee: 'community.seeInspectors'
  },
  3: {
    label: 'community.researchers',
    txtBtnSee: 'community.seeResearchers'
  },
  4: {
    label: 'community.developers',
    txtBtnSee: 'community.seeDevelopers'
  },
  5: {
    label: 'community.contributors',
    txtBtnSee: 'community.seeContributors'
  },
  6: {
    label: 'community.activists',
    txtBtnSee: 'community.seeActivists'
  },
  7: {
    label: 'community.supporters',
    txtBtnSee: 'community.seeSupporters'
  }
}

type UserTypesToData = keyof typeof dataByUserType
