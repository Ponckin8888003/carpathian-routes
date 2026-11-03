import { Link, useNavigate, useParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import usePlans from '../hooks/usePlans.js'
import useDeletePlan from '../hooks/useDeletePlan.js'

// /plans/:planId — перегляд одного плану, перехід до редагування й видалення.
function PlanDetailsPage({ peaks }) {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { plans } = usePlans()
  const confirmAndDelete = useDeletePlan()
  const plan = plans.find((entry) => entry.id === planId)

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

  function handleDelete() {
    const result = confirmAndDelete(plan, peakName)
    if (result.ok) navigate('/plans', { replace: true })
  }

  return (
    <>
      <PageHeading title={`План походу: ${peakName}`} />
      <dl className="plan-details">
        <dt>Дата походу</dt>
        <dd>{plan.date}</dd>
        <dt>Тривалість</dt>
        <dd>{plan.durationDays} дн.</dd>
        <dt>Нотатки</dt>
        <dd>{plan.notes}</dd>
        <dt>Порада щодо маршруту</dt>
        <dd>{plan.needsAdvice ? 'Потрібна' : 'Не потрібна'}</dd>
      </dl>
      <div className="form-actions">
        <Link className="app-button app-button-primary link-button" to="edit">
          Редагувати
        </Link>
        <AppButton variant="secondary" onClick={handleDelete}>
          Видалити
        </AppButton>
      </div>
      <p>
        <Link to="/plans">До списку планів</Link>
      </p>
    </>
  )
}

export default PlanDetailsPage
