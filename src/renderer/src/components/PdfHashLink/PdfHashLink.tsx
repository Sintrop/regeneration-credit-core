import { useNavigate } from 'react-router-dom'

interface Props {
  hash: string
  label?: string
}
export function PdfHashLink({ hash, label }: Props): JSX.Element {
  const navigate = useNavigate()

  function handleGoToPdfView(): void {
    navigate(`/pdfview/${hash}`)
  }

  return (
    <p
      className="text-white underline truncate text-ellipsis max-w-[80%] hover:cursor-pointer"
      onClick={handleGoToPdfView}
    >
      {label ? label : hash}
    </p>
  )
}
