import RoutesBadge from './RoutesBadge.jsx'

// Подання однієї вершини. peak — коректний запис із src/data/peaks.js.
function PeakCard({ peak }) {
  return (
    <article className="peak-card">
      <h3>{peak.name}</h3>
      <p className="meta">
        {peak.heightM} м · {peak.massif}
      </p>
      <p>{peak.description}</p>
      <p>
        <RoutesBadge hasRoutes={peak.hasRoutes} />
      </p>
    </article>
  )
}

export default PeakCard
