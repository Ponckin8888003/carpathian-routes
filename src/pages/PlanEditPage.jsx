import { useEffect, useRef } from 'react'
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

  // Відповідь старого редактора не має переспрямувати з іншого плану.
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

  async function handleSave(value) {
    const result = await updatePlan(plan.id, value)
    if (result.ok && pageAlive.current && activeId.current === plan.id) {
      navigate(detailsPath, { replace: true })
    }
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
