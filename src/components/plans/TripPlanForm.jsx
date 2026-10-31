import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

// Керована форма чернетки плану походу.
// draft належить власнику (PlanPage); форма лише показує його й повідомляє про зміни.
function TripPlanForm({
  idPrefix,
  peakName,
  draft,
  onDateChange,
  onNotesChange,
  onNeedsAdviceChange,
  onReset,
}) {
  const peakId = `${idPrefix}-peak`
  const dateId = `${idPrefix}-date`
  const notesId = `${idPrefix}-notes`
  const noticeId = `${idPrefix}-notice`

  return (
    <form
      aria-label="Чернетка плану походу"
      aria-describedby={noticeId}
      onSubmit={(event) => event.preventDefault()}
    >
      <p id={noticeId}>
        Зміни не зберігаються. Чернетка скидається при виході зі сторінки,
        зміні вершини чи плану або перезавантаженні. Збереження ще недоступне.
      </p>

      <FormField id={peakId} label="Вершина">
        <input id={peakId} name="peakName" value={peakName} readOnly />
      </FormField>

      <FormField id={dateId} label="Дата походу">
        <input
          id={dateId}
          name="date"
          type="date"
          value={draft.date}
          onChange={(event) => onDateChange(event.target.value)}
        />
      </FormField>

      <FormField
        id={notesId}
        label="Нотатки до походу"
        hint="Наприклад: з ким іду, що взяти з собою."
      >
        <textarea
          id={notesId}
          name="notes"
          rows={3}
          value={draft.notes}
          onChange={(event) => onNotesChange(event.target.value)}
          aria-describedby={`${notesId}-hint`}
        />
      </FormField>

      <label className="checkbox-field">
        <input
          name="needsAdvice"
          type="checkbox"
          checked={draft.needsAdvice}
          onChange={(event) => onNeedsAdviceChange(event.target.checked)}
        />
        Потрібна порада щодо маршруту
      </label>

      <div className="form-actions">
        <AppButton variant="secondary" onClick={onReset}>
          Очистити поля
        </AppButton>
        <AppButton disabled>Збереження буде доступне пізніше</AppButton>
      </div>
    </form>
  )
}

export default TripPlanForm
