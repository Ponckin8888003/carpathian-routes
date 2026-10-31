import { useState } from 'react'
import { Link } from 'react-router'
import RoutesBadge from './RoutesBadge.jsx'
import AppButton from '../ui/AppButton.jsx'

// Картка однієї вершини.
// detailsOpen — локальний стан картки; selected приходить ззовні,
// а про вибір картка лише повідомляє через onSelect(id).
function PeakCard({ peak, selected, onSelect }) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const descriptionId = `peak-${peak.id}-description`

  return (
    <article className={selected ? 'peak-card selected' : 'peak-card'}>
      <h3>
        <Link to={`/peaks/${encodeURIComponent(peak.id)}`}>{peak.name}</Link>
      </h3>
      <p className="meta">
        {peak.heightM} м · {peak.massif}
      </p>
      <p>
        <RoutesBadge hasRoutes={peak.hasRoutes} />
      </p>

      <AppButton
        variant="secondary"
        aria-expanded={detailsOpen}
        aria-controls={descriptionId}
        onClick={() => setDetailsOpen((previous) => !previous)}
      >
        {detailsOpen ? 'Згорнути опис' : 'Показати опис'}
      </AppButton>
      <p id={descriptionId} hidden={!detailsOpen}>
        {peak.description}
      </p>

      <p>
        <AppButton aria-pressed={selected} onClick={() => onSelect(peak.id)}>
          Вибрати «{peak.name}»
        </AppButton>
      </p>
      {selected && <p className="selection-note">Обрано для плану походу.</p>}
    </article>
  )
}

export default PeakCard
