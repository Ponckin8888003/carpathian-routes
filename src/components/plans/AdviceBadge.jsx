// Позначка потреби в пораді: текст + колір, а не лише колір.
function AdviceBadge({ needsAdvice }) {
  return (
    <span className={needsAdvice ? 'badge badge-yes' : 'badge badge-no'}>
      {needsAdvice ? 'Потрібна' : 'Не потрібна'}
    </span>
  )
}

export default AdviceBadge
