import { Link, useNavigate, useSearchParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import usePeakSelection from '../hooks/usePeakSelection.js'
import usePlans from '../hooks/usePlans.js'
import PlanPage from './PlanPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'

// /plans/new?peakId=hoverla — вершину визначає параметр адреси.
function PlanCreatePage({ peaks }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { selectedId, clearSelection } = usePeakSelection()
  const { createPlan } = usePlans()
  const peakId = searchParams.get('peakId')

  if (peakId === null) {
    const lastSelectionSearch = selectedId
      ? `?${new URLSearchParams({ peakId: selectedId })}`
      : null

    return (
      <>
        <PageHeading title="Новий план походу" />
        <EmptyState title="Спочатку виберіть вершину.">
          <p>
            <Link to="/peaks">Відкрити каталог вершин</Link>
          </p>
          {lastSelectionSearch && (
            <p>
              <Link to={lastSelectionSearch}>Використати останній вибір</Link>
            </p>
          )}
        </EmptyState>
      </>
    )
  }

  const peak = peaks.find((entry) => entry.id === peakId)

  if (!peak) {
    return (
      <NotFoundPage
        title="Неможливо підготувати план"
        message="Вершина з параметра peakId відсутня в каталозі."
      />
    )
  }

  function handleCancel() {
    clearSelection()
    navigate('/peaks', { replace: true })
  }

  function handleSave(value) {
    const result = createPlan(value)
    if (result.ok) {
      // replace: кнопка «Назад» не поверне до порожньої форми
      navigate(`/plans/${encodeURIComponent(result.record.id)}`, { replace: true })
    }
    return result
  }

  return (
    <PlanPage
      key={`new-${peak.id}`}
      title="Новий план походу"
      peak={peak}
      submitLabel="Створити план"
      onSave={handleSave}
      onCancel={handleCancel}
      cancelLabel="Скасувати чернетку й очистити вибір"
    />
  )
}

export default PlanCreatePage
