import { Loading } from '@renderer/components/Loading/Loading'
import { useDelationsUser } from '@renderer/domain/Community/useCases/useDelationsUser'
import { useTranslation } from 'react-i18next'
import { DelationItem } from './DelationItem/DelationItem'

interface Props {
  address: string
}

export function DelationsCard({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const { isLoading, delations } = useDelationsUser({ address })

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-3">
      <p className="text-gray-300 text-sm">{t('account.delations')}</p>

      {isLoading ? (
        <div className="overflow-hidden">
          <Loading size={50} />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {delations.length === 0 ? (
            <p className="text-white my-5">{t('account.noDelations')}</p>
          ) : (
            <>
              {delations.map((item) => (
                <DelationItem key={item.id} delation={item} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
