import { useContext } from 'react'
import { PeakSelectionContext } from '../context/PeakSelectionContext.js'

// Хук читає значення найближчого провайдера; власного стану не створює.
export default function usePeakSelection() {
  const selection = useContext(PeakSelectionContext)
  if (selection === null) {
    throw new Error(
      'usePeakSelection must be used within PeakSelectionProvider',
    )
  }
  return selection
}
