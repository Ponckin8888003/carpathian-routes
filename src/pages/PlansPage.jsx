import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PlanFilters from '../components/plans/PlanFilters.jsx'
import PlansTable from '../components/plans/PlansTable.jsx'
import usePlans from '../hooks/usePlans.js'
import usePlanFilters from '../hooks/usePlanFilters.js'
import useDeletePlan from '../hooks/useDeletePlan.js'

// Список планів: колекцію дає контекст, умови списку — адреса.
function PlansPage({ peaks }) {
  const { plans } = usePlans()
  const filters = usePlanFilters(plans, peaks)
  const confirmAndDelete = useDeletePlan()

  return (
    <>
      <PageHeading title="Плани походів" />
      <p>Створюйте, переглядайте, редагуйте та видаляйте плани походів.</p>

      {plans.length === 0 ? (
        <EmptyState title="Планів ще немає.">
          <p>
            <Link to="new">Підготувати новий план</Link>
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
          <p aria-live="polite">
            Показано: {filters.visiblePlans.length} із {plans.length}
          </p>
          {filters.visiblePlans.length === 0 ? (
            <EmptyState title="За цими умовами планів немає.">
              <p>Змініть пошук або скиньте умови.</p>
            </EmptyState>
          ) : (
            <PlansTable
              rows={filters.visiblePlans}
              onDelete={(row) => confirmAndDelete(row, row.peakName)}
            />
          )}
        </>
      )}
    </>
  )
}

export default PlansPage
