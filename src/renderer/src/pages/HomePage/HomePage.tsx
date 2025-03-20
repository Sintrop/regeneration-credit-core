import { useNavigate } from 'react-router-dom'

export function HomePage(): JSX.Element {
  const navigate = useNavigate()

  return (
    <div>
      <p>Home Page</p>
      <button onClick={() => navigate('/settings')}>settings</button>
    </div>
  )
}
