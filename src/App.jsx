import { Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import PlansLayout from './components/layout/PlansLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import CatalogContainer from './pages/CatalogContainer.jsx'
import PeakDetailsPage from './pages/PeakDetailsPage.jsx'
import PlansPage from './pages/PlansPage.jsx'
import PlanCreatePage from './pages/PlanCreatePage.jsx'
import PlanEditPage from './pages/PlanEditPage.jsx'
import PlanDetailsPage from './pages/PlanDetailsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { peaks } from './data/peaks.js'
import { plans } from './data/plans.js'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout peaks={peaks} initialPlans={plans} />}>
        <Route index element={<HomePage />} />
        <Route path="peaks">
          <Route index element={<CatalogContainer peaks={peaks} />} />
          <Route path=":peakId" element={<PeakDetailsPage peaks={peaks} />} />
        </Route>
        <Route path="plans" element={<PlansLayout />}>
          <Route index element={<PlansPage peaks={peaks} />} />
          <Route path="new" element={<PlanCreatePage peaks={peaks} />} />
          <Route path=":planId" element={<PlanDetailsPage peaks={peaks} />} />
          <Route path=":planId/edit" element={<PlanEditPage peaks={peaks} />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
