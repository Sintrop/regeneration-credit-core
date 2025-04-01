import { useParams } from 'react-router-dom'

export function TxPage(): JSX.Element {
  const params = useParams()

  return (
    <div className="flex flex-col">
      <p>TX page</p>
      <p>{params?.hash}</p>
    </div>
  )
}
