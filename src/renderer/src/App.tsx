import { MetamaskProvider } from '../../providers/metamask'
import { SettingsProvider } from './contexts/SettingsContext'
import { UserContextProvider } from './contexts/UserContext'
import { AppRoutes } from './routes'

function App(): JSX.Element {
  return (
    <SettingsProvider>
      <MetamaskProvider>
        <UserContextProvider>
          <AppRoutes />
        </UserContextProvider>
      </MetamaskProvider>
    </SettingsProvider>
  )
}

export default App
