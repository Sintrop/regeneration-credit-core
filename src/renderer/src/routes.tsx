import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { HomePage } from './pages/HomePage/HomePage'
import { SettingsPage } from './pages/SettingsPage/SettingsPage'
import { TxPage } from './pages/TxPage/TxPage'
import { ContractsPage } from './pages/ContractsPage/ContractsPage'
import { ContractPage } from './pages/ContractPage/ContractPage'
import { PoolsPage } from './pages/PoolsPage/PoolsPage'
import { PoolPage } from './pages/PoolPage/PoolPage'
import { InspectionsPage } from './pages/InspectionsPage/InspectionsPage'
import { MyTokensPage } from './pages/MyTokensPage/MyTokensPage'
import { AccountPage } from './pages/AccountPage/AccountPage'
import { RegisterPage } from './pages/RegisterPage/RegisterPage'
import { DevelopmentPage } from './pages/DevelopmentPage/DevelopmentPage'
import { RcStatsPage } from './pages/RcStatsPage/RcStatsPage'
import { ContributionsPage } from './pages/ContributionsPage/ContributionsPage'
import { ResearchesPage } from './pages/ResearchesPage/ResearchesPage'
import { CommunityPage } from './pages/CommunityPage/CommunityPage'
import { UsersPage } from './pages/UsersPage/UsersPage'
import { PdfPage } from './pages/PdfPage/PdfPage'
import { UserDetailsPage } from './pages/UserDetailsPage/UserDetailsPage'
import { ResourceDetailsPage } from './pages/ResourceDetailsPage/ResourceDetailsPage'
import { IpfsPage } from './pages/IpfsPage/IpfsPage'

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
        <Route path="/pools/:poolName" element={<PoolPage />} />
        <Route path="/inspections" element={<InspectionsPage />} />
        <Route path="/my-tokens" element={<MyTokensPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/development" element={<DevelopmentPage />} />
        <Route path="/rcstats" element={<RcStatsPage />} />
        <Route path="/contributions" element={<ContributionsPage />} />
        <Route path="/researches" element={<ResearchesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/users/:userType" element={<UsersPage />} />
        <Route path="/pdfview/:hash" element={<PdfPage />} />
        <Route path="/user-details/:address" element={<UserDetailsPage />} />
        <Route path="/resource-details/:resourceType/:id" element={<ResourceDetailsPage />} />
        <Route path="/ipfs" element={<IpfsPage />} />
      </Routes>
    </Router>
  )
}
