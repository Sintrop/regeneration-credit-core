import { useNavigate } from 'react-router-dom'

export function HomePage(): JSX.Element {
  const navigate = useNavigate()

  return (
    <div>
      HomePage

      <button onClick={() => navigate('/settings')}>
        Settings page
      </button>

    </div>
  )
}
