interface Props {
  label: string
  icon?: string
  onChange: (value: string) => void
  value: string
  isSelected?: boolean
}
export function TabItem({ label, isSelected, value, onChange }: Props): JSX.Element {
  return (
    <button
      className={`px-5 py-1 border-b-2 hover:cursor-pointer ${isSelected ? 'border-green-btn text-green-btn' : 'border-transparent text-white'}`}
      onClick={() => onChange(value)}
    >
      {label}
    </button>
  )
}
