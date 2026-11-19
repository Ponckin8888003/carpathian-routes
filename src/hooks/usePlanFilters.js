import { useSearchParams } from 'react-router'
import {
  normalizeAdvice,
  normalizeSort,
  selectPlans,
} from '../domain/selectPlans.js'

// Умови списку живуть в URL: ?q=говерла&advice=yes&sort=date-desc.
// Хук читає й змінює адресу; відбір виконує чиста функція selectPlans.
export default function usePlanFilters(plans, peaks) {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const advice = normalizeAdvice(searchParams.get('advice'))
  const sort = normalizeSort(searchParams.get('sort'))

  const visiblePlans = selectPlans(plans, peaks, { query, advice, sort })

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
