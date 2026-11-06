import { Outlet } from 'react-router'
import SiteHeader from './SiteHeader.jsx'
import PeakSelectionProvider from '../../providers/PeakSelectionProvider.jsx'
import PlansProvider from '../../providers/PlansProvider.jsx'

const navigationLinks = [
  { to: '/', label: 'Головна', end: true },
  { to: '/peaks', label: 'Вершини' },
  { to: '/plans', label: 'Плани походів' },
]

// Спільна оболонка. Сторінки показуються в Outlet.
// Провайдери розташовані тут, тому вибір вершини й колекція планів
// переживають переходи між сторінками.
function AppLayout({ peaks }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти до вмісту
      </a>
      <SiteHeader title="Карпатські маршрути" links={navigationLinks} />
      <main id="main-content" tabIndex={-1}>
        <PeakSelectionProvider peaks={peaks}>
          <PlansProvider>
            <Outlet />
          </PlansProvider>
        </PeakSelectionProvider>
      </main>
      <footer className="footer">Навчальний проєкт · ІФНТУНГ</footer>
    </>
  )
}

export default AppLayout
