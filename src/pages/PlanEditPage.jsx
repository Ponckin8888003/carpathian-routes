import { useNavigate, useParams } from 'react-router'
import PlanPage from './PlanPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'

// /plans/:planId/edit — запис і вершину визначають адреса та зв'язок peakId.
function PlanEditPage({ plans, peaks }) {
  const { planId } = useParams()
  const navigate = useNavigate()
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
        message="Демонстраційний запис посилається на відсутню вершину."
      />
    )
  }

  return (
    <PlanPage
      key={`edit-${plan.id}`}
      title={`Редагування плану ${plan.id}`}
      peak={peak}
      initialDraft={{
        date: plan.date,
        notes: plan.notes,
        needsAdvice: plan.needsAdvice,
      }}
      onCancel={() => navigate('/plans')}
    />
  )
}

export default PlanEditPage
