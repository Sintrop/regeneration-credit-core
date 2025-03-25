interface Props {
  methodType: string
}

export function MethodTag({ methodType }: Props): JSX.Element {
  return (
    <div
      className={`rounded-2xl px-3 py-1 ${methodType === 'view' ? 'bg-amber-400' : 'bg-purple-400'}`}
    >
      <p className="text-white text-sm">
        {methodType === 'view' && 'Read'}
        {methodType === 'nonpayable' && 'Write'}
      </p>
    </div>
  )
}
