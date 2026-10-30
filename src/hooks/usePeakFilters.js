import { useState } from 'react'

// Власний хук: стан фільтрів, видимий список і скидання.
// Дані надходять через параметр, хук нічого не імпортує й не знає про JSX.
export default function usePeakFilters(peaks) {
  const [query, setQuery] = useState('')
  const [routesOnly, setRoutesOnly] = useState(false)

  const normalizedQuery = query.trim().toLocaleLowerCase('uk')
  const visiblePeaks = peaks.filter(
    (peak) =>
      peak.name.toLocaleLowerCase('uk').includes(normalizedQuery) &&
      (!routesOnly || peak.hasRoutes),
  )

  function resetFilters() {
    setQuery('')
    setRoutesOnly(false)
  }

  return {
    query,
    setQuery,
    routesOnly,
    setRoutesOnly,
    visiblePeaks,
    resetFilters,
  }
}
