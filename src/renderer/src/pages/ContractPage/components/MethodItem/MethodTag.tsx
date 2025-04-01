interface Props {
  methodType: string
}

export function MethodTag({ methodType }: Props): JSX.Element {
  return (
    <div
      className={`rounded-2xl px-3 py-1 border ${methodType === 'view' ? 'border-amber-400' : 'border-purple-400'}`}
    >
      <p className={`text-sm ${methodType === 'view' ? 'text-amber-400' : 'text-purple-400'}`}>
        {methodType === 'view' && 'Read'}
        {methodType === 'nonpayable' && 'Write'}
      </p>
    </div>
  )
}
