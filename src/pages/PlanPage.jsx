import { useState } from 'react'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import RoutesBadge from '../components/peaks/RoutesBadge.jsx'
import TripPlanForm from '../components/plans/TripPlanForm.jsx'
import TripPlanSummary from '../components/plans/TripPlanSummary.jsx'
import { validatePlan } from '../domain/planValidation.js'

const emptyDraft = {
  date: '',
  durationDays: '',
  notes: '',
  needsAdvice: false,
}
const fieldOrder = ['date', 'durationDays', 'notes', 'needsAdvice']

// Спільний редактор для створення й редагування. Власник чернетки: draft,
// touched, attempted. Колекцією володіє PlansProvider; сюди вона не потрапляє,
// сторінка отримує лише дію onSave(value).
function PlanPage({
  title,
  peak,
  initialDraft = emptyDraft,
  submitLabel,
  onSave,
  onCancel,
  cancelLabel = 'Вийти без збереження',
}) {
  const [draft, setDraft] = useState(() => ({ ...initialDraft }))
  const [touched, setTouched] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [operationError, setOperationError] = useState('')

  const validation = validatePlan({ peakId: peak.id, ...draft }, [peak])
  // Помилку поля показуємо після виходу з поля або після спроби збереження.
  const visibleErrors = {}
  for (const field of fieldOrder) {
    if (validation.errors[field] && (attempted || touched[field])) {
      visibleErrors[field] = validation.errors[field]
    }
  }

  const isDirty = fieldOrder.some((field) => draft[field] !== initialDraft[field])

  function handleChange(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }))
    setOperationError('')
  }

  function handleBlur(field) {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setAttempted(true)

    if (!validation.ok) {
      const firstInvalid = fieldOrder.find((field) => validation.errors[field])
      document.getElementById(`plan-draft-${firstInvalid}`)?.focus()
      return
    }

    const result = onSave(validation.value)
    if (!result.ok) {
      setOperationError(result.message ?? 'Не вдалося зберегти план.')
    }
  }

  function handleReset() {
    if (isDirty && !window.confirm('Скинути поля до початкових значень?')) return
    setDraft({ ...initialDraft })
    setTouched({})
    setAttempted(false)
    setOperationError('')
  }

  function handleCancel() {
    if (isDirty && !window.confirm('Є незбережені зміни. Вийти без збереження?')) {
      return
    }
    onCancel()
  }

  const formError =
    operationError ||
    (attempted && !validation.ok ? 'Виправте позначені поля.' : '')

  return (
    <>
      <PageHeading title={title} />
      <Section id="plan-editor" title="Поля та підсумок">
        <p>
          Вершина «{peak.name}»: <RoutesBadge hasRoutes={peak.hasRoutes} />
        </p>
        <TripPlanForm
          idPrefix="plan-draft"
          peakName={peak.name}
          draft={draft}
          errors={visibleErrors}
          formError={formError}
          submitLabel={submitLabel}
          onChange={handleChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
        <TripPlanSummary peakName={peak.name} draft={draft} />
      </Section>
      <AppButton variant="secondary" onClick={handleCancel}>
        {cancelLabel}
      </AppButton>
    </>
  )
}

export default PlanPage
