import { useNavigate, useParams } from 'react-router'
import PlanPage from './PlanPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import usePlans from '../hooks/usePlans.js'

// /plans/:planId/edit — запис шукаємо в колекції з контексту.
function PlanEditPage({ peaks }) {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { plans, updatePlan } = usePlans()
  const plan = plans.find((entry) => entry.id === planId)

  if (!plan) {
    return (
      <NotFoundPage
        title="План не знайдено"
        message="Перевірте ідентифікатор плану в адресі."
      />
    )
  }

  const peak = peaks.find((entry) => entry.id === plan.peakId)

  if (!peak) {
    return (
      <NotFoundPage
        title="Вершина плану відсутня"
        message="План посилається на вершину, якої немає в каталозі."
      />
    )
  }

  const detailsPath = `/plans/${encodeURIComponent(plan.id)}`

  function handleSave(value) {
    const result = updatePlan(plan.id, value)
    if (result.ok) navigate(detailsPath)
    return result
  }

  return (
    <PlanPage
      key={`edit-${plan.id}`}
      title="Редагування плану"
      peak={peak}
      initialDraft={{
        date: plan.date,
        durationDays: String(plan.durationDays),
        notes: plan.notes,
        needsAdvice: plan.needsAdvice,
      }}
      submitLabel="Зберегти зміни"
      onSave={handleSave}
      onCancel={() => navigate(detailsPath)}
      cancelLabel="Скасувати та повернутися до плану"
    />
  )
}

export default PlanEditPage
