// Підсумок читає той самий draft, що й форма, і нічого не зберігає окремо.
function TripPlanSummary({ peakName, draft }) {
  const notes = draft.notes.trim()

  return (
    <aside className="plan-summary" aria-labelledby="plan-summary-title">
      <h3 id="plan-summary-title">Поточна чернетка</h3>
      <dl>
        <dt>Вершина</dt>
        <dd>{peakName}</dd>
        <dt>Дата походу</dt>
        <dd>{draft.date || 'Ще не вказано'}</dd>
        <dt>Нотатки</dt>
        <dd>{notes || 'Ще не вказано'}</dd>
        <dt>Порада щодо маршруту</dt>
        <dd>{draft.needsAdvice ? 'Потрібна' : 'Не потрібна'}</dd>
      </dl>
      <p>Цей підсумок не є збереженим планом походу.</p>
    </aside>
  )
}

export default TripPlanSummary
