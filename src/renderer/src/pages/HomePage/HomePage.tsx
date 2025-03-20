import { useNavigate } from 'react-router-dom'

export function HomePage(): JSX.Element {
  const navigate = useNavigate()

  return (
    <div>
      <p className="text-center text-red-500">Home Page</p>
      <button onClick={() => navigate('/settings')}>settings</button>
    </div>
  )
}
