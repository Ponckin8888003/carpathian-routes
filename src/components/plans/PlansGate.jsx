import usePlans from '../../hooks/usePlans.js'
import AppButton from '../ui/AppButton.jsx'

// Обмежувач розділу: сторінки бачать лише успішно прочитану колекцію,
// тому відсутній запис не показується до завершення читання.
function PlansGate({ children }) {
  const { status, error, reload } = usePlans()

  if (status === 'loading') {
    return (
      <section className="state-panel" aria-busy="true" aria-label="Плани">
        <span className="spinner" aria-hidden="true" />
        <p role="status">Завантаження планів…</p>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section
        className="state-panel state-panel-error"
        aria-label="Помилка завантаження"
      >
        <p role="alert">{error}</p>
        <AppButton onClick={() => void reload()}>Спробувати ще раз</AppButton>
      </section>
    )
  }

  return children
}

export default PlansGate
