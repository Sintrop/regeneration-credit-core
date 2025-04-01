interface Props {
  title: string
}

export function PageTitle({ title }: Props): JSX.Element {
  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-bold text-white text-4xl">{title}</h1>
    </section>
  )
}
