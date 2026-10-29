// Повідомлення про порожній результат. Текст задає місце використання.
function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <p>
        <strong>{title}</strong>
      </p>
      {children}
    </div>
  )
}

export default EmptyState
