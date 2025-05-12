import { PdfHashLink } from '@renderer/components/PdfHashLink/PdfHashLink';
import { useTranslation } from 'react-i18next'

interface Props {
  era: number;
  report: string;
}

export function ContributionFeedContent({ era, report }: Props): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col mt-2">
      <p className="text-white">Era: {era}</p>
      <p className="text-sm text-gray-300 mt-2">{t('contribution')}</p>
      <PdfHashLink hash={report} />
    </div>
  );
}
