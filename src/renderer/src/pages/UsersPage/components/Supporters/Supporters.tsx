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

      {idsList.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('anySupporterRegistered')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary">ID</th>
              <th className="p-2 border-r border-container-secondary">{t('wallet')}</th>
              <th className="p-2 border-r border-container-secondary">{t('name')}</th>
              <th className="p-2 border-r border-container-secondary">{t('createdAt')}</th>
              <th className="p-2">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {idsList.map((id, index) => (
              <SupporterItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
