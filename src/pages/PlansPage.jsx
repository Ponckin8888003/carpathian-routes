import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

// Список локальних демонстраційних планів. Посилання відносні: /plans/{id}/edit.
function PlansPage({ plans, peaks }) {
  return (
    <>
      <PageHeading title="Плани походів" />
      <p>Нижче наведено локальні демонстраційні записи.</p>
      {plans.length === 0 ? (
        <EmptyState title="Планів ще немає.">
          <p>
            <Link to="new">Підготувати новий план</Link>
          </p>
        </EmptyState>
      ) : (
        <div className="table-scroll">
          <table className="plans-table">
            <caption>Плани для перевірки навігації</caption>
            <thead>
              <tr>
                <th scope="col">Вершина</th>
                <th scope="col">Дата</th>
                <th scope="col">Нотатки</th>
                <th scope="col">Дія</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => {
                const peak = peaks.find((entry) => entry.id === plan.peakId)
                return (
                  <tr key={plan.id}>
                    <td>{peak?.name ?? 'Вершина відсутня в каталозі'}</td>
                    <td>{plan.date}</td>
                    <td>{plan.notes}</td>
                    <td>
                      <Link to={`${encodeURIComponent(plan.id)}/edit`}>
                        Редагувати {plan.id}
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default PlansPage
