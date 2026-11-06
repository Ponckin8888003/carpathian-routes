// Єдиний тип помилки сервісного рівня.
// code — для рішень програми, message — для користувача,
// status — для діагностики HTTP, errors — перевірені повідомлення за полями.
export class ServiceError extends Error {
  constructor(message, { code = 'UNKNOWN', status, errors } = {}) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
    this.status = status
    this.errors = errors
  }
}

export function errorMessage(error) {
  return error instanceof ServiceError
    ? error.message
    : 'Не вдалося виконати операцію. Спробуйте ще раз.'
}
