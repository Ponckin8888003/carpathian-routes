import { useEffect, useState } from 'react'
import { planService } from '../services/planService.js'
import { errorMessage } from '../services/ServiceError.js'

// Окреме читання одного плану через getById. Захист від застарілих відповідей:
// ignore + AbortController, а також порівняння id та attempt зі станом.
export default function usePlanRecord(id) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({
    id: null,
    attempt: -1,
    status: 'loading',
    record: null,
    error: '',
  })

  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    async function load() {
      try {
        const record = await planService.getById(id, {
          signal: controller.signal,
        })
        if (!ignore) {
          setState({ id, attempt, status: 'success', record, error: '' })
        }
      } catch (cause) {
        if (ignore || controller.signal.aborted) return
        setState({
          id,
          attempt,
          status: cause.code === 'NOT_FOUND' ? 'not-found' : 'error',
          record: null,
          error: errorMessage(cause),
        })
      }
    }

    void load()
    return () => {
      ignore = true
      controller.abort()
    }
  }, [id, attempt])

  const current =
    state.id === id && state.attempt === attempt
      ? state
      : { status: 'loading', record: null, error: '' }

  return { ...current, retry: () => setAttempt((value) => value + 1) }
}
