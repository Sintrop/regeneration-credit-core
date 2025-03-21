interface Props {
  method: string
}
export function TransactionMethodTag({ method }: Props): JSX.Element {
  return (
    <div className="bg-container-secondary rounded-md px-3 py-1">
      <p className="text-white text-sm">{method}</p>
    </div>
  )
}
