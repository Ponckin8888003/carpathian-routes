import usePlans from './usePlans.js'

// Видалення з підтвердженням. Повертає Promise з результатом операції:
// { ok: true } | { ok: false, message } | { ok: false, cancelled: true }.
export default function useDeletePlan() {
  const { deletePlan } = usePlans()

  return async function deleteWithConfirmation(plan, peakName) {
    const confirmed = window.confirm(
      `Видалити план походу на «${peakName}» (${plan.date})?`,
    )
    if (!confirmed) return { ok: false, cancelled: true }
    return deletePlan(plan.id)
  }
}
