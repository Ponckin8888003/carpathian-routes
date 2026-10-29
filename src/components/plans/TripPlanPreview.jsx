import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

// Макет форми плану походу. Дані не зберігаються.
// idPrefix має бути унікальним, якщо на сторінці кілька таких форм.
function TripPlanPreview({ idPrefix, peakName }) {
  const peakId = `${idPrefix}-peak`
  const dateId = `${idPrefix}-date`
  const notesId = `${idPrefix}-notes`
  const noticeId = `${idPrefix}-notice`

  return (
    <form
      aria-label="Макет плану походу"
      aria-describedby={noticeId}
      onSubmit={(event) => event.preventDefault()}
    >
      <p id={noticeId}>
        Це макет для перевірки структури полів. Дані не зберігаються.
      </p>

      <FormField id={peakId} label="Вершина">
        <input id={peakId} name="peakName" value={peakName} readOnly />
      </FormField>

      <FormField id={dateId} label="Дата походу">
        <input id={dateId} name="date" type="date" defaultValue="" />
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
          defaultValue=""
          aria-describedby={`${notesId}-hint`}
        />
      </FormField>

      <div className="form-actions">
        <AppButton type="reset" variant="secondary">
          Очистити поля
        </AppButton>
        <AppButton disabled>Збереження буде доступне пізніше</AppButton>
      </div>
    </form>
  )
}

export default TripPlanPreview
