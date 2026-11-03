import usePlans from './usePlans.js'

// Видалення з підтвердженням. Підтвердження стоїть у хуку, тому однакове
// і в таблиці, і на сторінці деталей.
export default function useDeletePlan() {
  const { deletePlan } = usePlans()

  return function confirmAndDelete(plan, peakName) {
    const confirmed = window.confirm(
      `Видалити план походу на «${peakName}» (${plan.date})?`,
    )
    if (!confirmed) return { ok: false, cancelled: true }
    return deletePlan(plan.id)
  }
}
