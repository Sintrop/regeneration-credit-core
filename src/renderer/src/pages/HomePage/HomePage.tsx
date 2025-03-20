import { Header } from '@renderer/components/Header/Header'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function HomePage(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <Header />

      <main>
        <p className="text-center text-red-500">Home Page</p>
        <button onClick={() => navigate('/settings')}>settings</button>
        <p className='mt-10 text-center'>{t('helloWorld')}</p>
      </main>
    </>
  )
}
