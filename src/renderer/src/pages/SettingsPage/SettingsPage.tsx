import { useNavigate } from 'react-router-dom'

export function SettingsPage(): JSX.Element {
  const navigate = useNavigate()

  return (
    <div>
      <p>Settings Page</p>
      <button onClick={() => navigate(-1)}>back home</button>
    </div>
  )
}
