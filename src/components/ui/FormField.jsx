// Обгортка поля: підпис, підказка та повідомлення про помилку.
// Вкладене поле має мати той самий id і aria-describedby="{id}-hint {id}-error".
function FormField({ id, label, hint, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
