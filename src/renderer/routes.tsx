import React from 'react'
import { Router } from '../lib/electron-router-dom'
import { Route } from 'react-router-dom'

import { HomePage } from './src/pages/HomePage/HomePage'
import { SettingsPage } from './src/pages/SettingsPage/SettingsPage'

export function AppRoutes(): React.JSX.Element {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </>
      }
    />
  )
}
