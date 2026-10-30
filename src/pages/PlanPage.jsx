import { useEffect, useState } from 'react'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import RoutesBadge from '../components/peaks/RoutesBadge.jsx'
import TripPlanForm from '../components/plans/TripPlanForm.jsx'
import TripPlanSummary from '../components/plans/TripPlanSummary.jsx'

function createEmptyDraft() {
  return { date: '', notes: '', needsAdvice: false }
}

// PlanPage — власник чернетки: форма й підсумок бачать один об'єкт draft.
function PlanPage({ peak, onClearSelection }) {
  const [draft, setDraft] = useState(createEmptyDraft)
  const title = peak ? `Карпатські маршрути: ${peak.name}` : 'Карпатські маршрути'

  // Синхронізація із зовнішньою системою: заголовок вкладки браузера.
  useEffect(() => {
    const previousTitle = document.title
    document.title = title
    return () => {
      document.title = previousTitle
    }
  }, [title])

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
    setDraft(createEmptyDraft())
  }

  // Хуки викликано вище, тому умовне повернення порядок хуків не змінює.
  if (!peak) {
    return (
      <Section id="plan" title="Підготовка плану походу">
        <EmptyState title="Вершину ще не вибрано.">
          <p>
            <a href="#peaks">Виберіть вершину в каталозі</a>
          </p>
        </EmptyState>
      </Section>
    )
  }

  return (
    <Section id="plan" title="Підготовка плану походу">
      <p>
        Обрано «{peak.name}»: <RoutesBadge hasRoutes={peak.hasRoutes} />
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
      <AppButton variant="secondary" onClick={onClearSelection}>
        Скасувати вибір і очистити чернетку
      </AppButton>
    </Section>
  )
}

export default PlanPage
