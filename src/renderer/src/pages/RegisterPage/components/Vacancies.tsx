import { Loading } from '@renderer/components/Loading/Loading'
import { useMainnet } from '@renderer/hooks/useMainnet'
import { checkVacancies } from '@renderer/services/checkVacancies'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useReadContracts } from 'wagmi'

interface Props {
  userType: number
  onChange: (availableVacancie: boolean) => void
}

export function Vacancies({ userType, onChange }: Props): JSX.Element {
  const { t } = useTranslation()
  const mainnet = useMainnet()
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: mainnet ? userAddress : sequoiaUserAddress,
        abi: mainnet ? userAbi : sequoiaUserAbi,
        functionName: 'userTypesCount',
        args: [1]
      },
      {
        address: mainnet ? userAddress : sequoiaUserAddress,
        abi: mainnet ? userAbi : sequoiaUserAbi,
        functionName: 'userTypesCount',
        args: [userType]
      }
    ]
  })

  let availableVacancies: boolean = false

  if (data) {
    if (data[0].status === 'success' && data[0].status === 'success') {
      const producersCount = parseInt(data[0].result as string)
      const userTypeCount = parseInt(data[1].result as string)

      const response = checkVacancies({ producersCount, userType, userTypeCount })
      availableVacancies = response.availableVacancie
      onChange(availableVacancies)
    }
  }

  return (
    <div className="flex flex-col">
      <p className="text-gray-300 text-sm">{t('register.vacancies')}</p>
      <div className="flex flex-col w-full p-3 rounded-2xl bg-container-secondary ">
        <p className="text-gray-300 text-sm">{t('register.descVacancies')}</p>

        {isLoading ? (
          <Loading size={50} />
        ) : (
          <p className="text-white">
            {availableVacancies ? t('register.thereIsVacancie') : t('register.thereIsntVacancie')}
          </p>
        )}
      </div>
    </div>
  )
}
