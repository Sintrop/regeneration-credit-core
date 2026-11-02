import { DelationItem } from '@renderer/components/DelationItem/DelationItem'
import { useUserDelationsIds } from '@renderer/domain/Community/useCases/useUserDelationsIds'
import { useTranslation } from 'react-i18next'

interface Props {
  address: string
}
export function DelationsCard({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const { delationsIds } = useUserDelationsIds({ address })

  return (
    <section className="flex flex-col gap-3 p-5 rounded-2xl bg-card-primary">
      <p className="text-white font-bold">{t('account.delations')}</p>

      <div className="flex flex-col">
        {delationsIds.length === 0 ? (
          <p className="text-gray-400 text-sm">{t('feed.noDelations')}</p>
        ) : (
          <div className="flex flex-col gap-3 w-full max-h-[1000px] overflow-y-auto">
            {[...delationsIds].reverse().map((item) => (
              <DelationItem id={item} key={item} hideReported />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
