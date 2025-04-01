interface Props {
  transactionTypes: string[]
}
export function TransactionTypeTag({ transactionTypes }: Props): JSX.Element {
  if (transactionTypes.length === 0) {
    return <div />
  }

  return (
    <div className="bg-container-secondary rounded-md px-3 py-1">
      <p className="text-white text-sm">{transactionTypes[0]}</p>
    </div>
  )
}
