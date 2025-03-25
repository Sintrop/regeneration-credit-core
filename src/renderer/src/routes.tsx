import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { HomePage } from './pages/HomePage/HomePage'
import { SettingsPage } from './pages/SettingsPage/SettingsPage'
import { TxPage } from './pages/TxPage/TxPage'
import { ContractsPage } from './pages/ContractsPage/ContractsPage'
import { ContractPage } from './pages/ContractPage/ContractPage'
import { PoolsPage } from './pages/PoolsPage/PoolsPage'

export function AppRoutes(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/tx/:hash" element={<TxPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/contracts/:address" element={<ContractPage />} />
        <Route path="/pools" element={<PoolsPage />} />
      </Routes>
    </Router>
  )
}
