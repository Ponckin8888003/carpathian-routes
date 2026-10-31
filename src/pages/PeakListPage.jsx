import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import CatalogSummary from '../components/peaks/CatalogSummary.jsx'
import PeakFilters from '../components/peaks/PeakFilters.jsx'
import PeakList from '../components/peaks/PeakList.jsx'
import usePeakFilters from '../hooks/usePeakFilters.js'

// Сторінка каталогу. Фільтри читаються з URL (див. usePeakFilters).
function PeakListPage({ peaks, selectedId, onSelect }) {
  const { query, setQuery, routesOnly, setRoutesOnly, visiblePeaks, resetFilters } =
    usePeakFilters(peaks)

  const planSearch = selectedId
    ? `?${new URLSearchParams({ peakId: selectedId })}`
    : ''

  return (
    <>
      <PageHeading title="Каталог вершин" />
      <Section id="catalog" title="Пошук і вибір">
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
          <Link to={`/plans/new${planSearch}`}>Підготувати новий план походу</Link>
        </p>
      </Section>
    </>
  )
}

export default PeakListPage
