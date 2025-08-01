import { useTranslation } from 'react-i18next'
import { RegeneratorItem } from './RegeneratorItem'

interface Props {
  idsList: number[]
}

export function Regenerators({ idsList }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      {idsList.length === 0 ? (
        <div className="flex flex-col mt-10 items-center">
          <p className="text-white">{t('community.noRegeneratorsRegistered')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary">ID</th>
              <th className="p-2 border-r border-container-secondary max-w-[100px]">
                {t('community.wallet')}
              </th>
              <th className="p-2 border-r border-container-secondary">{t('community.name')}</th>
              <th className="p-2 border-r border-container-secondary">
                {t('community.createdAt')}
              </th>
              <th className="p-2 border-r border-container-secondary">{t('community.area')}</th>
              <th className="p-2 border-r border-container-secondary">
                {t('community.inspections')}
              </th>
              <th className="p-2 border-r border-container-secondary">{t('community.score')}</th>
              <th className="p-2">{t('community.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {idsList.map((id, index) => (
              <RegeneratorItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
