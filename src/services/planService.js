import { mockPlanService } from './mockPlanService.js'
import { createApiPlanService } from './apiPlanService.js'

// Єдине місце вибору реалізації. Решта коду імпортує лише planService.
export const dataSource = import.meta.env.VITE_DATA_SOURCE ?? 'mock'

function selectService() {
  if (dataSource === 'mock') return mockPlanService
  if (dataSource === 'api') {
    return createApiPlanService(import.meta.env.VITE_API_BASE_URL)
  }
  throw new Error(`Unsupported data source: ${dataSource}`)
}

export const planService = selectService()
