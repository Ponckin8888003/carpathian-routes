import { Link } from 'react-router'
import AppButton from '../ui/AppButton.jsx'

// Таблиця планів. Рядки вже містять peakName; видалення передається власнику.
function PlansTable({ rows, onDelete }) {
  return (
    <div className="table-scroll">
      <table className="plans-table">
        <caption>Плани походів</caption>
        <thead>
          <tr>
            <th scope="col">Вершина</th>
            <th scope="col">Дата</th>
            <th scope="col">Днів</th>
            <th scope="col">Порада</th>
            <th scope="col">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.peakName}</td>
              <td>{row.date}</td>
              <td>{row.durationDays}</td>
              <td>{row.needsAdvice ? 'Потрібна' : 'Не потрібна'}</td>
              <td>
                <div className="row-actions">
                  <Link to={encodeURIComponent(row.id)}>
                    Переглянути<span className="visually-hidden"> {row.peakName}, {row.date}</span>
                  </Link>
                  <Link to={`${encodeURIComponent(row.id)}/edit`}>
                    Редагувати<span className="visually-hidden"> {row.peakName}, {row.date}</span>
                  </Link>
                  <AppButton variant="secondary" onClick={() => onDelete(row)}>
                    Видалити<span className="visually-hidden"> {row.peakName}, {row.date}</span>
                  </AppButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PlansTable
