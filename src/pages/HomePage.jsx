import Section from '../components/ui/Section.jsx'
import CatalogSummary from '../components/peaks/CatalogSummary.jsx'
import PeakFilters from '../components/peaks/PeakFilters.jsx'
import PeakList from '../components/peaks/PeakList.jsx'
import usePeakFilters from '../hooks/usePeakFilters.js'

// Сторінка — власник фільтрів. Повний масив і вибір надходять через props.
function HomePage({ peaks, selectedId, onSelect }) {
  const { query, setQuery, routesOnly, setRoutesOnly, visiblePeaks, resetFilters } =
    usePeakFilters(peaks)

  return (
    <>
      <Section id="about" title="Про сервіс">
        <p>
          «Карпатські маршрути» допомагають переглянути вершини Українських
          Карпат і спланувати похід.
        </p>
        <p>Виберіть вершину й перейдіть до чернетки плану походу.</p>
      </Section>

      <Section id="peaks" title="Вершини">
        <CatalogSummary total={peaks.length} />
        <PeakFilters
          query={query}
          routesOnly={routesOnly}
          onQueryChange={setQuery}
          onRoutesOnlyChange={setRoutesOnly}
          onReset={resetFilters}
        />
        <p>Показано вершин: {visiblePeaks.length}</p>
        <PeakList
          peaks={visiblePeaks}
          selectedId={selectedId}
          onSelect={onSelect}
          emptyTitle={
            peaks.length === 0
              ? 'Вершини ще не додано.'
              : 'За цими фільтрами нічого не знайдено.'
          }
        />
        <p>
          <a href="#plan">Перейти до чернетки плану</a>
        </p>
      </Section>
    </>
  )
}

export default HomePage
