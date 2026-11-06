import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

// Керовані умови списку: значення надходять з URL через usePlanFilters.
function PlanFilters({
  query,
  advice,
  sort,
  onQueryChange,
  onAdviceChange,
  onSortChange,
  onReset,
}) {
  return (
    <div className="catalog-filters plan-filters">
      <FormField id="plans-query" label="Пошук за вершиною або нотатками">
        <input
          id="plans-query"
          type="search"
          name="query"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </FormField>
      <FormField id="plans-advice" label="Порада щодо маршруту">
        <select
          id="plans-advice"
          value={advice}
          onChange={(event) => onAdviceChange(event.target.value)}
        >
          <option value="">Усі плани</option>
          <option value="yes">Порада потрібна</option>
          <option value="no">Порада не потрібна</option>
        </select>
      </FormField>
      <FormField id="plans-sort" label="Сортування">
        <select
          id="plans-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="">Як додано</option>
          <option value="date-asc">За датою: спочатку ранні</option>
          <option value="date-desc">За датою: спочатку пізні</option>
          <option value="days-desc">За тривалістю: спочатку довші</option>
          <option value="peak">За назвою вершини</option>
        </select>
      </FormField>
      <AppButton variant="secondary" onClick={onReset}>
        Скинути умови
      </AppButton>
    </div>
  )
}

export default PlanFilters
