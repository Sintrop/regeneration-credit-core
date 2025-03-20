import { MetamaskProvider } from '../../providers/metamask'
import { AppRoutes } from './routes'

function App(): JSX.Element {
  return (
    <MetamaskProvider>
      <AppRoutes />
    </MetamaskProvider>
  )
}

export default App
