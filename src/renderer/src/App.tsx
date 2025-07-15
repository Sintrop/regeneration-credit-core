import { MetamaskProvider } from '../../providers/metamask'
import { UserContextProvider } from './contexts/UserContext'
import { AppRoutes } from './routes'

function App(): JSX.Element {
  return (
    <MetamaskProvider>
      <UserContextProvider>
        <AppRoutes />
      </UserContextProvider>
    </MetamaskProvider>
  )
}

export default App
