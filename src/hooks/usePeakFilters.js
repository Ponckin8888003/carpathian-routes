import { useSearchParams } from 'react-router'

// Фільтри живуть в URL: ?q=говерла&routes=1.
// Окремих useState немає, тому адресу можна скопіювати й відкрити повторно.
export default function usePeakFilters(peaks) {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const routesOnly = searchParams.get('routes') === '1'

  const normalizedQuery = query.trim().toLocaleLowerCase('uk')
  const visiblePeaks = peaks.filter(
    (peak) =>
      peak.name.toLocaleLowerCase('uk').includes(normalizedQuery) &&
      (!routesOnly || peak.hasRoutes),
  )

  function setQuery(value) {
    const next = new URLSearchParams(searchParams)
    if (value === '') next.delete('q')
    else next.set('q', value)
    // replace: кожна літера не створює окремий запис в історії
    setSearchParams(next, { replace: true })
  }

  function setRoutesOnly(value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('routes', '1')
    else next.delete('routes')
    setSearchParams(next)
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('routes')
    setSearchParams(next)
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
