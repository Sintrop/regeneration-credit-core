import { RiCloseCircleFill } from 'react-icons/ri'
import { FaCheckCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface Props {
  status: string
}
export function TransactionStatusTag({ status }: Props): JSX.Element {
  const { t } = useTranslation()
  const TagData = TagVariants[status as StatusType] || VariantDefault

  return (
    <div
      className={`rounded-md px-3 py-1 flex items-center gap-2`}
      style={{ backgroundColor: TagData.bgColor }}
    >
      <TagData.Icon size={20} color="white" />
      <p className="text-white text-sm">{t(TagData.label)}</p>
    </div>
  )
}

const TagVariants = {
  error: {
    bgColor: '#ef4444',
    label: 'failed',
    Icon: RiCloseCircleFill
  },
  ok: {
    bgColor: '#1eb762',
    label: 'success',
    Icon: FaCheckCircle
  }
}

const VariantDefault = {
  bgColor: '#012939',
  label: ''
}

type StatusType = keyof typeof TagVariants
