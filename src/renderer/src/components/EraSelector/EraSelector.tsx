interface Props {
  selectedEra: number
  currentEra: number
  onChange: (era: number) => void
}

export function EraSelector({ currentEra, selectedEra, onChange }: Props): JSX.Element {
  const count = Array.from({ length: currentEra }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-2 mb-2">
      <p className="text-white">ERA:</p>
      {count.map((item) => (
        <ButtonEra key={item} isSelected={selectedEra === item} value={item} onChange={onChange} />
      ))}
    </div>
  )
}

interface ButtonEraProps {
  isSelected: boolean
  value: number
  onChange: (era: number) => void
}
function ButtonEra({ isSelected, value, onChange }: ButtonEraProps): JSX.Element {
  return (
    <button
      className={`py-1 px-3 rounded-md border-2 text-white font-bold bg-container-primary hover:cursor-pointer ${isSelected ? 'border-green-600' : 'border-transparent'}`}
      onClick={() => onChange(value)}
    >
      {value}
    </button>
  )
}
