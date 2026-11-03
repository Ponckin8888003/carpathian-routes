import { useSearchParams } from 'react-router'

// Умови списку живуть в URL: ?q=говерла&advice=yes&sort=date-desc.
const sorters = {
  'date-asc': (a, b) => a.date.localeCompare(b.date),
  'date-desc': (a, b) => b.date.localeCompare(a.date),
  'days-desc': (a, b) => b.durationDays - a.durationDays,
  peak: (a, b) => a.peakName.localeCompare(b.peakName, 'uk'),
}

export default function usePlanFilters(plans, peaks) {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const advice = searchParams.get('advice') ?? ''
  const sort = searchParams.get('sort') ?? ''

  const rows = plans.map((plan) => ({
    ...plan,
    peakName:
      peaks.find((peak) => peak.id === plan.peakId)?.name ?? 'Вершина відсутня',
  }))

  const normalizedQuery = query.trim().toLocaleLowerCase('uk')
  const filtered = rows.filter((row) => {
    const matchesText =
      row.peakName.toLocaleLowerCase('uk').includes(normalizedQuery) ||
      row.notes.toLocaleLowerCase('uk').includes(normalizedQuery)
    const matchesAdvice =
      advice === '' ||
      (advice === 'yes' && row.needsAdvice) ||
      (advice === 'no' && !row.needsAdvice)
    return matchesText && matchesAdvice
  })

  // Сортуємо копію, щоб не змінити масив зі стану.
  const visiblePlans = sorters[sort] ? [...filtered].sort(sorters[sort]) : filtered

  function setParam(name, value, replace = false) {
    const next = new URLSearchParams(searchParams)
    if (value === '') next.delete(name)
    else next.set(name, value)
    setSearchParams(next, { replace })
  }

  function resetFilters() {
    setSearchParams(new URLSearchParams())
  }

  return {
    query,
    advice,
    sort,
    visiblePlans,
    setQuery: (value) => setParam('q', value, true),
    setAdvice: (value) => setParam('advice', value),
    setSort: (value) => setParam('sort', value),
    resetFilters,
  }
}
