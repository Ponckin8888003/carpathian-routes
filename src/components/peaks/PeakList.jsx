import PeakCard from './PeakCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'

// Список лише передає вибір униз і callback до карток.
// peaks — обов'язковий масив; порожній масив допустимий.
function PeakList({
  peaks,
  selectedId,
  onSelect,
  emptyTitle = 'Вершини ще не додано.',
}) {
  if (peaks.length === 0) {
    return <EmptyState title={emptyTitle} />
  }

  return (
    <ul className="peak-grid">
      {peaks.map((peak) => (
        <li key={peak.id}>
          <PeakCard
            peak={peak}
            selected={peak.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  )
}

export default PeakList
