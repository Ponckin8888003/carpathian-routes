import PlanPage from './PlanPage.jsx'
import usePeakSelection from '../hooks/usePeakSelection.js'

// key зі selectedId: нова вершина створює нову (порожню) чернетку.
function PlanContainer() {
  const { selectedId, selectedPeak, clearSelection } = usePeakSelection()

  return (
    <PlanPage
      key={selectedId ?? 'empty'}
      peak={selectedPeak}
      onClearSelection={clearSelection}
    />
  )
}

export default PlanContainer
