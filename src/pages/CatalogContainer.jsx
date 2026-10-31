import PeakListPage from './PeakListPage.jsx'
import usePeakSelection from '../hooks/usePeakSelection.js'

// Адаптує контекст вибору до props сторінки каталогу.
function CatalogContainer({ peaks }) {
  const { selectedId, selectPeak } = usePeakSelection()

  return (
    <PeakListPage peaks={peaks} selectedId={selectedId} onSelect={selectPeak} />
  )
}

export default CatalogContainer
