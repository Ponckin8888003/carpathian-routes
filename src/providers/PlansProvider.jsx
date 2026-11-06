import { useCallback, useEffect, useRef, useState } from 'react'
import PlansContext from '../context/PlansContext.js'
import { planService } from '../services/planService.js'
import { errorMessage } from '../services/ServiceError.js'

// Власник знімка підтверджених даних. Читання й запис виконує planService;
// провайдер лише зберігає результат і стани операцій.
function PlansProvider({ children }) {
  const [plans, setPlans] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isMutating, setIsMutating] = useState(false)
  const activeRead = useRef(null)
  const readVersion = useRef(0)
  const mutationLock = useRef(false)
  const mounted = useRef(false)
  const [loadToken, setLoadToken] = useState(0)

  // Читання виконує ефект: зміна loadToken запускає нове читання, а очищення
  // ефекту скасовує попереднє. Початковий стан уже 'loading'.
  useEffect(() => {
    mounted.current = true
    const controller = new AbortController()
    activeRead.current = controller
    const version = ++readVersion.current

    async function load() {
      try {
        const records = await planService.getAll({ signal: controller.signal })
        // Застаріла відповідь не затирає новіший знімок.
        if (controller.signal.aborted || version !== readVersion.current) return
        setPlans(records)
        setStatus('success')
      } catch (cause) {
        if (controller.signal.aborted || version !== readVersion.current) return
        setError(errorMessage(cause))
        setStatus('error')
      }
    }

    void load()
    return () => {
      mounted.current = false
      controller.abort()
      readVersion.current += 1
    }
  }, [loadToken])

  // Повторне читання за дією користувача: показуємо завантаження й запускаємо ефект.
  const reload = useCallback(() => {
    if (mutationLock.current) return
    setStatus('loading')
    setError('')
    setLoadToken((token) => token + 1)
  }, [])

  // Одна операція запису за раз. Колекція змінюється лише після успіху сервісу.
  async function mutate(operation, apply, message) {
    if (mutationLock.current || status !== 'success') {
      return { ok: false, message: 'Дочекайтеся завершення поточної операції.' }
    }
    mutationLock.current = true
    setIsMutating(true)
    setNotice('')
    activeRead.current?.abort()
    readVersion.current += 1
    try {
      const record = await operation()
      if (mounted.current) {
        setPlans((previous) => apply(previous, record))
        setNotice(message)
      }
      return { ok: true, record }
    } catch (cause) {
      return {
        ok: false,
        message: errorMessage(cause),
        errors: cause.errors,
        code: cause.code,
      }
    } finally {
      mutationLock.current = false
      if (mounted.current) setIsMutating(false)
    }
  }

  function createPlan(input) {
    return mutate(
      () => planService.create(input),
      (previous, record) => [
        ...previous.filter((entry) => entry.id !== record.id),
        record,
      ],
      'План створено.',
    )
  }

  function updatePlan(id, input) {
    return mutate(
      () => planService.update(id, input),
      (previous, record) =>
        previous.map((entry) => (entry.id === id ? record : entry)),
      'Зміни збережено.',
    )
  }

  function deletePlan(id) {
    return mutate(
      () => planService.delete(id),
      (previous) => previous.filter((entry) => entry.id !== id),
      'План видалено.',
    )
  }

  const value = {
    plans,
    status,
    error,
    reload,
    isMutating,
    createPlan,
    updatePlan,
    deletePlan,
    notice,
    dismissNotice: () => setNotice(''),
  }

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>
}

export default PlansProvider
