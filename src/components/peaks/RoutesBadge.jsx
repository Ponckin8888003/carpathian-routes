// Єдине правило підпису про наявність маршрутів.
// hasRoutes має бути логічним значенням (true або false), а не рядком.
function RoutesBadge({ hasRoutes }) {
  const label = hasRoutes ? 'Маршрути додано' : 'Маршрутів ще немає'
  const className = hasRoutes ? 'status available' : 'status'
  return <span className={className}>{label}</span>
}

export default RoutesBadge
