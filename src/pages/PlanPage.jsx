import { useState } from 'react'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import RoutesBadge from '../components/peaks/RoutesBadge.jsx'
import TripPlanForm from '../components/plans/TripPlanForm.jsx'
import TripPlanSummary from '../components/plans/TripPlanSummary.jsx'

const emptyDraft = { date: '', notes: '', needsAdvice: false }

// Спільний редактор чернетки. Маршрутні сторінки передають перевірену вершину,
// початкові поля та дію виходу; URL редактор не читає.
function PlanPage({
  title,
  peak,
  initialDraft = emptyDraft,
  onCancel,
  cancelLabel = 'Вийти без збереження',
}) {
  const [draft, setDraft] = useState(() => ({ ...initialDraft }))

  function handleDateChange(date) {
    setDraft((previous) => ({ ...previous, date }))
  }

  function handleNotesChange(notes) {
    setDraft((previous) => ({ ...previous, notes }))
  }

  function handleNeedsAdviceChange(needsAdvice) {
    setDraft((previous) => ({ ...previous, needsAdvice }))
  }

  function handleReset() {
    setDraft({ ...emptyDraft })
  }

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
          onDateChange={handleDateChange}
          onNotesChange={handleNotesChange}
          onNeedsAdviceChange={handleNeedsAdviceChange}
          onReset={handleReset}
        />
        <TripPlanSummary peakName={peak.name} draft={draft} />
      </Section>
      <AppButton variant="secondary" onClick={onCancel}>
        {cancelLabel}
      </AppButton>
    </>
  )
}

export default PlanPage
