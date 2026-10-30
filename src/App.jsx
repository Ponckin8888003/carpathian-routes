import AppLayout from './components/layout/AppLayout.jsx'
import PeakSelectionProvider from './providers/PeakSelectionProvider.jsx'
import CatalogContainer from './pages/CatalogContainer.jsx'
import PlanContainer from './pages/PlanContainer.jsx'
import { peaks } from './data/peaks.js'

const navigationLinks = [
  { href: '#about', label: 'Про сервіс' },
  { href: '#peaks', label: 'Вершини' },
  { href: '#plan', label: 'План походу' },
]

function App() {
  return (
    <AppLayout title="Карпатські маршрути" links={navigationLinks}>
      <PeakSelectionProvider peaks={peaks}>
        <CatalogContainer peaks={peaks} />
        <PlanContainer />
      </PeakSelectionProvider>
    </AppLayout>
  )
}

export default App
