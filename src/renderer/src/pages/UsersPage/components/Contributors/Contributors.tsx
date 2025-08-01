import { useTranslation } from 'react-i18next'
import { ContributorItem } from './ContributorItem'

interface Props {
  idsList: number[]
}

export function Contributors({ idsList }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      {idsList.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('community.noContributorsRegistered')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary">ID</th>
              <th className="p-2 border-r border-container-secondary">{t('community.wallet')}</th>
              <th className="p-2 border-r border-container-secondary">{t('community.name')}</th>
              <th className="p-2 border-r border-container-secondary">
                {t('community.createdAt')}
              </th>
              <th className="p-2 border-r border-container-secondary">
                {t('community.totalConributions')}
              </th>
              <th className="p-2 border-r border-container-secondary">{t('community.level')}</th>
              <th className="p-2">{t('community.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {idsList.map((id, index) => (
              <ContributorItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
