interface Props {
  label: string
  handleSendTransaction: () => void
  disabled?: boolean
}

/** Primary button of every action dialog: sends the transaction to the wallet. */
export function SendTransactionButton({
  label,
  handleSendTransaction,
  disabled
}: Props): JSX.Element {
  return (
    <button
      className="w-full h-11 mt-5 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      onClick={handleSendTransaction}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
