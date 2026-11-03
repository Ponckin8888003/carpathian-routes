import { useState } from 'react'
import PlansContext from '../context/PlansContext.js'
import { validatePlan } from '../domain/planValidation.js'

// Єдиний власник колекції планів. Дані живуть лише в пам'яті:
// після перезавантаження сторінки повертаються початкові записи.
function PlansProvider({ initialPlans, peaks, children }) {
  const [plans, setPlans] = useState(() => [...initialPlans])
  const [notice, setNotice] = useState('')

  function createPlan(input) {
    const validation = validatePlan(input, peaks)
    if (!validation.ok) return { ok: false, errors: validation.errors }

    // id створюємо до setState, щоб оновлення стану лишалося чистим.
    const record = { id: `plan-${crypto.randomUUID()}`, ...validation.value }
    setPlans((previous) => [...previous, record])
    setNotice('План створено.')
    return { ok: true, record }
  }

  function updatePlan(id, input) {
    if (!plans.some((plan) => plan.id === id)) {
      return { ok: false, errors: {}, message: 'План не знайдено.' }
    }
    const validation = validatePlan(input, peaks)
    if (!validation.ok) return { ok: false, errors: validation.errors }

    const record = { id, ...validation.value }
    setPlans((previous) =>
      previous.map((plan) => (plan.id === id ? record : plan)),
    )
    setNotice('Зміни збережено.')
    return { ok: true, record }
  }

  function deletePlan(id) {
    if (!plans.some((plan) => plan.id === id)) {
      return { ok: false, message: 'План не знайдено.' }
    }
    setPlans((previous) => previous.filter((plan) => plan.id !== id))
    setNotice('План видалено.')
    return { ok: true }
  }

  function dismissNotice() {
    setNotice('')
  }

  const value = {
    plans,
    createPlan,
    updatePlan,
    deletePlan,
    notice,
    dismissNotice,
  }

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>
}

export default PlansProvider
