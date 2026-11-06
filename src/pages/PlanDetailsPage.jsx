import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import usePlans from '../hooks/usePlans.js'
import useDeletePlan from '../hooks/useDeletePlan.js'
import AdviceBadge from '../components/plans/AdviceBadge.jsx'

// /plans/:planId — перегляд одного плану, перехід до редагування й видалення.
function PlanDetailsPage({ peaks }) {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { plans, isMutating } = usePlans()
  const [error, setError] = useState('')
  const confirmAndDelete = useDeletePlan()
  const plan = plans.find((entry) => entry.id === planId)

  const pageAlive = useRef(false)
  const activeId = useRef(planId)
  useEffect(() => {
    pageAlive.current = true
    activeId.current = planId
    return () => {
      pageAlive.current = false
      activeId.current = null
    }
  }, [planId])

  if (!plan) {
    return (
      <NotFoundPage
        title="План не знайдено"
        message="Можливо, його видалено або адреса містить помилку."
      />
    )
  }

  const peakName =
    peaks.find((entry) => entry.id === plan.peakId)?.name ?? 'Вершина відсутня'

  async function handleDelete() {
    if (isMutating) return
    setError('')
    const result = await confirmAndDelete(plan, peakName)
    if (!pageAlive.current || activeId.current !== plan.id) return
    if (result.ok) navigate('/plans', { replace: true })
    else if (!result.cancelled) setError(result.message)
  }

  return (
    <>
      <PageHeading title={`План походу: ${peakName}`} />
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <dl className="plan-details">
        <dt>Дата походу</dt>
        <dd>{plan.date}</dd>
        <dt>Тривалість</dt>
        <dd>{plan.durationDays} дн.</dd>
        <dt>Нотатки</dt>
        <dd>{plan.notes}</dd>
        <dt>Порада щодо маршруту</dt>
        <dd>
          <AdviceBadge needsAdvice={plan.needsAdvice} />
        </dd>
      </dl>
      <div className="form-actions">
        <Link className="app-button app-button-primary link-button" to="edit">
          Редагувати
        </Link>
        <AppButton variant="danger" disabled={isMutating} onClick={handleDelete}>
          Видалити
        </AppButton>
      </div>
      <p role="status" className="submit-status">
        {isMutating ? 'Опрацювання зміни…' : ''}
      </p>
      <p>
        <Link to="/plans">До списку планів</Link>
      </p>
    </>
  )
}

export default PlanDetailsPage
