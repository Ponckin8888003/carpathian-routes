import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

// Керовані фільтри: показують отримані значення й повідомляють про зміну.
function PeakFilters({
  query,
  routesOnly,
  onQueryChange,
  onRoutesOnlyChange,
  onReset,
}) {
  return (
    <div className="catalog-filters">
      <FormField id="catalog-query" label="Пошук за назвою">
        <input
          id="catalog-query"
          type="search"
          name="query"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </FormField>
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={routesOnly}
          onChange={(event) => onRoutesOnlyChange(event.target.checked)}
        />
        Лише з маршрутами
      </label>
      <AppButton variant="secondary" onClick={onReset}>
        Скинути фільтри
      </AppButton>
    </div>
  )
}

export default PeakFilters
