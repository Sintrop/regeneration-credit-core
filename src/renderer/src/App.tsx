import { MetamaskProvider } from '../../providers/metamask'
import { HomePage } from './pages/HomePage/HomePage'

function App(): JSX.Element {
  return (
    <MetamaskProvider>
      <HomePage />
    </MetamaskProvider>
  )
}

export default App
