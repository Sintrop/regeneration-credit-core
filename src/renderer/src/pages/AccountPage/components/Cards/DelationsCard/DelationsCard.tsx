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
    <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-1">
      <p className="text-gray-300 text-sm">{t('account.delations')}</p>

      <div className="flex flex-col">
        {delationsIds.length === 0 ? (
          <div className="items-center my-10 w-[500px]">
            <p className="text-white text-center">{t('feed.noDelations')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 w-full max-h-[1000px] overflow-y-auto border-t border-container-secondary">
            {delationsIds.reverse().map((item) => (
              <DelationItem id={item} key={item} hideReported />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
