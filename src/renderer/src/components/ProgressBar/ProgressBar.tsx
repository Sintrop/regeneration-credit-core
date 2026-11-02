export function ProgressBar({ value }: { value: number }): JSX.Element {
  return (
    <div className="h-2 rounded-full bg-card-secondary overflow-hidden">
      <div
        className="h-full rounded-full bg-green-primary"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
