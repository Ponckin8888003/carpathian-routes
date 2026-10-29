import { peaks } from '../data/peaks.js'
import Section from '../components/ui/Section.jsx'
import CatalogSummary from '../components/peaks/CatalogSummary.jsx'
import PeakList from '../components/peaks/PeakList.jsx'

// Сторінка поєднує дані й компоненти подання.
function HomePage() {
  return (
    <>
      <Section id="about" title="Про сервіс">
        <p>
          «Карпатські маршрути» допомагають переглянути вершини Українських
          Карпат і спланувати похід.
        </p>
      </Section>

      <Section id="peaks" title="Вершини">
        <CatalogSummary total={peaks.length} />
        <PeakList peaks={peaks} />
      </Section>
    </>
  )
}

export default HomePage
