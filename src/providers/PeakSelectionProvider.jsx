import { useState } from 'react'
import { PeakSelectionContext } from '../context/PeakSelectionContext.js'

// Єдиний власник вибору вершини. selectedPeak — похідне значення.
function PeakSelectionProvider({ peaks, children }) {
  const [selectedId, setSelectedId] = useState(null)
  const selectedPeak = peaks.find((peak) => peak.id === selectedId)

  function selectPeak(id) {
    if (peaks.some((peak) => peak.id === id)) {
      setSelectedId(id)
    }
  }

  function clearSelection() {
    setSelectedId(null)
  }

  const value = { selectedId, selectedPeak, selectPeak, clearSelection }

  return (
    <PeakSelectionContext.Provider value={value}>
      {children}
    </PeakSelectionContext.Provider>
  )
}

export default PeakSelectionProvider
