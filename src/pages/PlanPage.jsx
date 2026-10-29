import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import RoutesBadge from '../components/peaks/RoutesBadge.jsx'
import TripPlanPreview from '../components/plans/TripPlanPreview.jsx'

// peak може бути відсутнім: тоді показуємо пояснення.
function PlanPage({ peak }) {
  return (
    <Section id="plan" title="Підготовка плану походу">
      {peak ? (
        <>
          <p>
            Приклад для вершини «{peak.name}»:{' '}
            <RoutesBadge hasRoutes={peak.hasRoutes} />
          </p>
          <TripPlanPreview idPrefix="plan-preview" peakName={peak.name} />
        </>
      ) : (
        <EmptyState title="Немає вершини для макета плану.">
          <p>
            <a href="#peaks">Переглянути каталог</a>
          </p>
        </EmptyState>
      )}
    </Section>
  )
}

export default PlanPage
