import PeakCard from './PeakCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'

// peaks — обов'язковий масив. Порожній масив — допустиме значення.
function PeakList({ peaks }) {
  if (peaks.length === 0) {
    return (
      <EmptyState title="Вершини ще не додано.">
        <p>Після наповнення каталогу тут з’являться картки вершин.</p>
      </EmptyState>
    )
  }

  return (
    <ul className="peak-grid">
      {peaks.map((peak) => (
        <li key={peak.id}>
          <PeakCard peak={peak} />
        </li>
      ))}
    </ul>
  )
}

export default PeakList
