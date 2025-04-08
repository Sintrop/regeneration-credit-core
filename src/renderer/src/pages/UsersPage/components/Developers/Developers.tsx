import { useTranslation } from 'react-i18next'
import { DeveloperItem } from './DeveloperItem'

interface Props {
  idsList: number[]
}

export function Developers({ idsList }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('developersCount')}: {idsList.length}
      </p>
      <div className="flex flex-col overflow-x-auto bg-container-primary rounded-2xl">
        <div className="flex items-center px-5 h-10 border-b-2 border-container-secondary">
          <div className="border-r border-container-secondary min-w-[50px]">
            <p className="text-white font-semibold">ID</p>
          </div>

          <div className="border-r border-container-secondary min-w-[400px] pl-5">
            <p className="text-white font-semibold">{t('wallet')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[300px] pl-5">
            <p className="text-white font-semibold">{t('name')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[120px] pl-5">
            <p className="text-white font-semibold">{t('createdAt')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[120px] pl-5">
            <p className="text-white font-semibold">{t('totalReports')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[100px] pl-5">
            <p className="text-white font-semibold">{t('level')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[120px] pl-5">
            <p className="text-white font-semibold">{t('actions')}</p>
          </div>
        </div>

        {idsList.length === 0 ? (
          <div className="flex flex-col mt-10 items-center">
            <p className="text-white">{t('anyDevelopersRegistered')}</p>
          </div>
        ) : (
          <>
            {idsList.map((id, index) => (
              <DeveloperItem key={index} id={id} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
