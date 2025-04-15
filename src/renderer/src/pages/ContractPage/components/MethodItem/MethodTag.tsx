interface Props {
  methodType: string
}

export function MethodTag({ methodType }: Props): JSX.Element {
  return (
    <div
      className={`rounded-lg px-3 py-1 ${methodType === 'view' ? 'bg-[#5EB1FF]' : 'bg-[#4ACA91]'}`}
    >
      <p className="text-sm text-white">
        {methodType === 'view' && 'Read'}
        {methodType === 'nonpayable' && 'Write'}
      </p>
    </div>
  )
}
