interface Props {
  label: string
  handleSendTransaction: () => void
  disabled?: boolean
}

export function SendTransactionButton({
  label,
  handleSendTransaction,
  disabled
}: Props): JSX.Element {
  return (
    <button
      className={`px-10 h-10 mt-5 mb-3 w-fit rounded-2xl bg-blue-primary text-white ${disabled ? 'hover:cursor-default opacity-50' : 'opacity-100 hover:cursor-pointer'}`}
      onClick={handleSendTransaction}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
