import { Link, useNavigate, useParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import RoutesBadge from '../components/peaks/RoutesBadge.jsx'
import usePeakSelection from '../hooks/usePeakSelection.js'
import NotFoundPage from './NotFoundPage.jsx'

// Вершина визначається адресою /peaks/:peakId, а не останнім вибором.
function PeakDetailsPage({ peaks }) {
  const { peakId } = useParams()
  const navigate = useNavigate()
  const { selectPeak } = usePeakSelection()
  const peak = peaks.find((entry) => entry.id === peakId)

  if (!peak) {
    return (
      <NotFoundPage
        title="Вершину не знайдено"
        message="У локальному каталозі немає вершини з таким ідентифікатором."
      />
    )
  }

  function handlePreparePlan() {
    selectPeak(peak.id)
    const search = new URLSearchParams({ peakId: peak.id })
    navigate(`/plans/new?${search}`)
  }

  return (
    <>
      <PageHeading title={peak.name} />
      <p className="meta">
        {peak.heightM} м · {peak.massif}
      </p>
      <p>{peak.description}</p>
      <p>
        <RoutesBadge hasRoutes={peak.hasRoutes} />
      </p>
      <AppButton onClick={handlePreparePlan}>
        Вибрати й підготувати план походу
      </AppButton>
      <p>
        <Link to="/peaks">До каталогу без фільтрів</Link>
      </p>
    </>
  )
}

export default PeakDetailsPage
