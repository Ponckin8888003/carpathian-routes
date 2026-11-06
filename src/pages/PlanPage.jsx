import { useEffect, useRef, useState } from 'react'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  // ref блокує повторне подання одразу, ще до наступного рендеру
  const submitting = useRef(false)
  const alive = useRef(false)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

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

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting.current) return
    setAttempted(true)
    setOperationError('')

    if (!validation.ok) {
      const firstInvalid = fieldOrder.find((field) => validation.errors[field])
      document.getElementById(`plan-draft-${firstInvalid}`)?.focus()
      return
    }

    submitting.current = true
    setIsSubmitting(true)
    try {
      // await на кожній межі: помилку аналізуємо лише після відповіді сервісу
      const result = await onSave(validation.value)
      if (!result.ok && alive.current) {
        setOperationError(
          result.errors
            ? Object.values(result.errors).join(' ')
            : result.message || 'Не вдалося зберегти план.',
        )
      }
    } catch {
      if (alive.current) setOperationError('Не вдалося завершити збереження.')
    } finally {
      submitting.current = false
      if (alive.current) setIsSubmitting(false)
    }
  }

  function handleReset() {
    if (submitting.current) return
    if (isDirty && !window.confirm('Скинути поля до початкових значень?')) return
    setDraft({ ...initialDraft })
    setTouched({})
    setAttempted(false)
    setOperationError('')
  }

  function handleCancel() {
    if (submitting.current) return
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
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
        <TripPlanSummary peakName={peak.name} draft={draft} />
      </Section>
      <AppButton
        variant="secondary"
        disabled={isSubmitting}
        onClick={handleCancel}
      >
        {cancelLabel}
      </AppButton>
    </>
  )
}

export default PlanPage
