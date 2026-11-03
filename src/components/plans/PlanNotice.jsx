import usePlans from '../../hooks/usePlans.js'
import AppButton from '../ui/AppButton.jsx'

// Повідомлення про результат операції. role="status" озвучується без переходу фокусу.
function PlanNotice() {
  const { notice, dismissNotice } = usePlans()
  if (!notice) return null

  return (
    <div className="operation-notice" role="status">
      <span>{notice}</span>
      <AppButton variant="secondary" onClick={dismissNotice}>
        Закрити повідомлення
      </AppButton>
    </div>
  )
}

export default PlanNotice
