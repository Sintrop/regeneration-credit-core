interface Props {
  title: string
  value: string
}

export function StatsRcItem({ title, value }: Props): JSX.Element {
  return (
    <div className="flex flex-1 gap-3 items-center rounded-2xl bg-container-primary p-2 min-w-[200px]">
      <div className="w-5 h-5 rounded-full bg-amber-400" />
      <div className="flex flex-col">
        <p className="text-white">{value}</p>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  )
}
