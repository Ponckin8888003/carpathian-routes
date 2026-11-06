import { useState } from 'react'
import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import PlanFilters from '../components/plans/PlanFilters.jsx'
import PlansTable from '../components/plans/PlansTable.jsx'
import MockFailurePanel from '../components/plans/MockFailurePanel.jsx'
import usePlans from '../hooks/usePlans.js'
import usePlanFilters from '../hooks/usePlanFilters.js'
import useDeletePlan from '../hooks/useDeletePlan.js'

// Список планів. Колекцію дає контекст (вже успішно прочитану обмежувачем),
// умови списку беруться з адреси.
function PlansPage({ peaks }) {
  const { plans, isMutating, reload } = usePlans()
  const filters = usePlanFilters(plans, peaks)
  const confirmAndDelete = useDeletePlan()
  const [actionError, setActionError] = useState('')

  async function handleDelete(row) {
    if (isMutating) return
    setActionError('')
    const result = await confirmAndDelete(row, row.peakName)
    if (!result.ok && !result.cancelled) setActionError(result.message)
  }

  return (
    <>
      <PageHeading title="Плани походів" />
      <p>Створюйте, переглядайте, редагуйте та видаліть плани походів.</p>

      <div className="toolbar">
        <AppButton
          variant="secondary"
          disabled={isMutating}
          onClick={() => void reload()}
        >
          Оновити дані
        </AppButton>
        <span className="submit-status" role="status">
          {isMutating ? 'Опрацювання зміни…' : ''}
        </span>
      </div>
      <MockFailurePanel disabled={isMutating} />

      {actionError && (
        <p className="field-error" role="alert">
          {actionError}
        </p>
      )}

      {plans.length === 0 ? (
        <EmptyState title="Планів ще немає.">
          <p>Виберіть вершину в каталозі та створіть перший план походу.</p>
          <p>
            <Link to="/peaks">Відкрити каталог вершин</Link>
          </p>
        </EmptyState>
      ) : (
        <>
          <PlanFilters
            query={filters.query}
            advice={filters.advice}
            sort={filters.sort}
            onQueryChange={filters.setQuery}
            onAdviceChange={filters.setAdvice}
            onSortChange={filters.setSort}
            onReset={filters.resetFilters}
          />
          {filters.visiblePlans.length === 0 ? (
            <EmptyState title="За вибраними умовами планів не знайдено.">
              <AppButton variant="secondary" onClick={filters.resetFilters}>
                Скинути умови
              </AppButton>
            </EmptyState>
          ) : (
            <>
              <p role="status" className="result-count">
                Знайдено планів: {filters.visiblePlans.length} із {plans.length}.
              </p>
              <PlansTable
                rows={filters.visiblePlans}
                disabled={isMutating}
                onDelete={handleDelete}
              />
            </>
          )}
        </>
      )}
    </>
  )
}

export default PlansPage
