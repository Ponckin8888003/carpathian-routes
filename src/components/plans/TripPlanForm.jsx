import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

// Керована форма плану походу. Чернетку, помилки й дії дає власник (PlanPage).
function TripPlanForm({
  idPrefix,
  peakName,
  draft,
  errors,
  formError,
  submitLabel,
  isSubmitting,
  onChange,
  onBlur,
  onSubmit,
  onReset,
}) {
  const peakId = `${idPrefix}-peak`
  const dateId = `${idPrefix}-date`
  const daysId = `${idPrefix}-durationDays`
  const notesId = `${idPrefix}-notes`
  const adviceId = `${idPrefix}-needsAdvice`

  // Підказка й помилка разом описують поле для допоміжних технологій.
  function describedBy(id, hasHint, hasError) {
    const ids = []
    if (hasHint) ids.push(`${id}-hint`)
    if (hasError) ids.push(`${id}-error`)
    return ids.length > 0 ? ids.join(' ') : undefined
  }

  return (
    <form
      aria-label="План походу"
      aria-busy={isSubmitting}
      noValidate
      onSubmit={onSubmit}
    >
      <fieldset className="form-fieldset" disabled={isSubmitting}>
      <legend>Дані плану</legend>
      {formError && (
        <p className="field-error" role="alert">
          {formError}
        </p>
      )}

      <FormField id={peakId} label="Вершина">
        <input id={peakId} name="peakName" value={peakName} readOnly />
      </FormField>

      <FormField id={dateId} label="Дата походу" error={errors.date}>
        <input
          id={dateId}
          name="date"
          type="date"
          value={draft.date}
          onChange={(event) => onChange('date', event.target.value)}
          onBlur={() => onBlur('date')}
          aria-invalid={errors.date ? 'true' : undefined}
          aria-describedby={describedBy(dateId, false, errors.date)}
        />
      </FormField>

      <FormField
        id={daysId}
        label="Тривалість, днів"
        hint="Ціле число від 1 до 7."
        error={errors.durationDays}
      >
        <input
          id={daysId}
          name="durationDays"
          type="number"
          min="1"
          max="7"
          step="1"
          value={draft.durationDays}
          onChange={(event) => onChange('durationDays', event.target.value)}
          onBlur={() => onBlur('durationDays')}
          aria-invalid={errors.durationDays ? 'true' : undefined}
          aria-describedby={describedBy(daysId, true, errors.durationDays)}
        />
      </FormField>

      <FormField
        id={notesId}
        label="Нотатки до походу"
        hint="Від 10 до 500 символів: з ким іду, що взяти з собою."
        error={errors.notes}
      >
        <textarea
          id={notesId}
          name="notes"
          rows={3}
          value={draft.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          onBlur={() => onBlur('notes')}
          aria-invalid={errors.notes ? 'true' : undefined}
          aria-describedby={describedBy(notesId, true, errors.notes)}
        />
      </FormField>

      <div className="form-field">
        <label className="checkbox-field">
          <input
            id={adviceId}
            name="needsAdvice"
            type="checkbox"
            checked={draft.needsAdvice}
            onChange={(event) => onChange('needsAdvice', event.target.checked)}
            onBlur={() => onBlur('needsAdvice')}
            aria-invalid={errors.needsAdvice ? 'true' : undefined}
            aria-describedby={describedBy(adviceId, false, errors.needsAdvice)}
          />
          Потрібна порада щодо маршруту
        </label>
        {errors.needsAdvice && (
          <p id={`${adviceId}-error`} className="field-error">
            {errors.needsAdvice}
          </p>
        )}
      </div>

      <div className="form-actions">
        <AppButton variant="secondary" onClick={onReset}>
          Скинути поля
        </AppButton>
        <AppButton type="submit">
          {isSubmitting ? 'Збереження…' : submitLabel}
        </AppButton>
      </div>
      </fieldset>
      <p role="status" className="submit-status">
        {isSubmitting ? 'Збереження плану…' : ''}
      </p>
    </form>
  )
}

export default TripPlanForm
