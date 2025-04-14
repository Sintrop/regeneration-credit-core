import { useNavigate } from 'react-router-dom'

interface Props {
  address: string
}
export function UserAddressLink({ address }: Props): JSX.Element {
  const navigate = useNavigate()

  function handleGoToUserDetails(): void {
    navigate(`/user-details/${address}`)
  }

  return (
    <p
      onClick={handleGoToUserDetails}
      className="text-white underline max-w-[90%] text-ellipsis truncate hover:cursor-pointer"
    >
      {address}
    </p>
  )
}
