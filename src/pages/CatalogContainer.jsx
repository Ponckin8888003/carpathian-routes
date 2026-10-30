import HomePage from './HomePage.jsx'
import usePeakSelection from '../hooks/usePeakSelection.js'

// Адаптує контекст вибору до props сторінки каталогу.
function CatalogContainer({ peaks }) {
  const { selectedId, selectPeak } = usePeakSelection()

  return <HomePage peaks={peaks} selectedId={selectedId} onSelect={selectPeak} />
}

export default CatalogContainer
