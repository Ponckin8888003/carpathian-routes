import { dataSource } from '../../services/planService.js'
import { failNextMockRequest } from '../../services/mockPlanService.js'
import AppButton from '../ui/AppButton.jsx'

const operations = [
  ['getAll', 'читання списку'],
  ['create', 'створення'],
  ['update', 'оновлення'],
  ['delete', 'видалення'],
]

// Навчальний засіб перевірки: працює лише в режимі розроблення з mock-джерелом.
// У виробничій збірці панель не показується. Прибрати: цей файл і рядок у PlansPage.
function MockFailurePanel({ disabled }) {
  if (!import.meta.env.DEV || dataSource !== 'mock') return null

  return (
    <details className="dev-panel">
      <summary>Режим перевірки відмов (лише розроблення)</summary>
      <p>Наступна операція вибраного типу завершиться відмовою один раз.</p>
      <div className="form-actions">
        {operations.map(([operation, label]) => (
          <AppButton
            key={operation}
            variant="secondary"
            disabled={disabled}
            onClick={() => failNextMockRequest(operation)}
          >
            Відмова: {label}
          </AppButton>
        ))}
      </div>
    </details>
  )
}

export default MockFailurePanel
