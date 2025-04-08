import { useTranslation } from 'react-i18next'
import { SupporterItem } from './SupporterItem'

interface Props {
  idsList: number[]
}

export function Supporters({ idsList }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('supportersCount')}: {idsList.length}
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
            <p className="text-white font-semibold">{t('actions')}</p>
          </div>
        </div>

        {idsList.length === 0 ? (
          <div className="items-center mt-10">
            <p className="text-white text-center">{t('anySupporterRegistered')}</p>
          </div>
        ) : (
          <>
            {idsList.map((id, index) => (
              <SupporterItem key={index} id={id} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
