import { useTranslation } from 'react-i18next'

interface Props {
  certificateTokens: string
  name?: string
}

export function ContributionCertificate({ certificateTokens, name }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col rounded-2xl bg-green-card p-3 w-[500px]">
      <div className="flex flex-col items-center justify-center w-full h-14 border-b border-container-secondary pb-2">
        <p className="text-white font-bold">{name}</p>

        <p className="text-white">
          {t('contributedWith')}{' '}
          <span className="font-bold text-green-600 text-lg">
            {Intl.NumberFormat('pt-BR').format(parseInt(certificateTokens))}
          </span>{' '}
          RC
        </p>
      </div>

      <div className="flex items-center h-full w-full mt-1">
        <div className="flex flex-col flex-1 p-3 h-full">
          <p className="text-gray-300 text-sm">{t('impact')}</p>
        </div>

        <div className="flex-1 h-full flex flex-col items-center justify-center">
          <p className="text-white">qr-code</p>
          <div className="w-36 h-36 bg-white" />
        </div>
      </div>
    </div>
  )
}
