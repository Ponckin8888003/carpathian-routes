// Відбір і сортування планів: чиста функція без React, URL і сховища.
// Умови приходять з адреси, тому невідомі значення приводимо до «без умови».
const adviceValues = ['yes', 'no']

const sorters = {
  'date-asc': (a, b) => a.date.localeCompare(b.date),
  'date-desc': (a, b) => b.date.localeCompare(a.date),
  'days-desc': (a, b) => b.durationDays - a.durationDays,
  peak: (a, b) => a.peakName.localeCompare(b.peakName, 'uk'),
}

export function normalizeAdvice(value) {
  return adviceValues.includes(value) ? value : ''
}

export function normalizeSort(value) {
  return Object.hasOwn(sorters, value) ? value : ''
}

// Повертає нові рядки з додатковим полем peakName; вхідні масиви не змінюються.
export function selectPlans(plans, peaks, { query, advice, sort }) {
  const names = new Map(peaks.map((peak) => [peak.id, peak.name]))
  const rows = plans.map((plan) => ({
    ...plan,
    peakName: names.get(plan.peakId) ?? 'Вершина відсутня',
  }))

  const normalizedQuery = query.trim().toLocaleLowerCase('uk')
  const normalizedAdvice = normalizeAdvice(advice)
  const filtered = rows.filter((row) => {
    const matchesText =
      row.peakName.toLocaleLowerCase('uk').includes(normalizedQuery) ||
      row.notes.toLocaleLowerCase('uk').includes(normalizedQuery)
    const matchesAdvice =
      normalizedAdvice === '' ||
      (normalizedAdvice === 'yes' ? row.needsAdvice : !row.needsAdvice)
    return matchesText && matchesAdvice
  })

  const sortKey = normalizeSort(sort)
  if (sortKey === '') return filtered
  // Рівні значення впорядковуємо за id, щоб порядок не залежав від джерела.
  return filtered.sort((a, b) => sorters[sortKey](a, b) || a.id.localeCompare(b.id))
}
