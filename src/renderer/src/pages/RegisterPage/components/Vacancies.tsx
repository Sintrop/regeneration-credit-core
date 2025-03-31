import { checkVacancies } from '@renderer/services/checkVacancies'
import { sequoiaUserAbi, sequoiaUserAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContracts } from 'wagmi'

interface Props {
  userType: number
}

export function Vacancies({ userType }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data } = useReadContracts({
    contracts: [
      {
        address: chainId === 1600 ? sequoiaUserAddress : sequoiaUserAddress,
        abi: chainId === 1600 ? sequoiaUserAbi : sequoiaUserAbi,
        functionName: 'userTypesCount',
        args: [1]
      },
      {
        address: chainId === 1600 ? sequoiaUserAddress : sequoiaUserAddress,
        abi: chainId === 1600 ? sequoiaUserAbi : sequoiaUserAbi,
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
    }
  }

  return (
    <div className="flex flex-col">
      <p className="text-gray-300 text-sm">{t('vacancies')}</p>
      <div className="flex flex-col p-3 rounded-2xl bg-container-secondary">
        <p className="text-gray-300 text-sm">{t('descVacancies')}</p>
        <p className="text-white">
          {availableVacancies ? t('thereIsVacancie') : t('thereIsntVacancie')}
        </p>
      </div>
    </div>
  )
}
