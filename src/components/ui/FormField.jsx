// Обгортка поля: підпис + підказка. Вкладене поле має мати той самий id,
// а за наявності підказки — aria-describedby="{id}-hint".
function FormField({ id, label, hint, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
    </div>
  )
}

export default FormField
