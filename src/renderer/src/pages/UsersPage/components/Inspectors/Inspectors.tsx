import { useTranslation } from 'react-i18next'
import { InspectorItem } from './InspectorItem'

interface Props {
  idsList: number[]
}

export function Inspectors({ idsList }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('inspectorsCount')}: {idsList.length}
      </p>

      {idsList.length === 0 ? (
        <div className="flex flex-col mt-10 items-center">
          <p className="text-white">{t('anyInspectorsRegistered')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary">ID</th>
              <th className="p-2 border-r border-container-secondary">{t('wallet')}</th>
              <th className="p-2 border-r border-container-secondary">{t('name')}</th>
              <th className="p-2 border-r border-container-secondary">{t('createdAt')}</th>
              <th className="p-2 border-r border-container-secondary">{t('inspections')}</th>
              <th className="p-2 border-r border-container-secondary">{t('level')}</th>
              <th className="p-2">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {idsList.map((id, index) => (
              <InspectorItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
