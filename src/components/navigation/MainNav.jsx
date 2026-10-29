// links: масив об'єктів { href, label } без повторення адрес.
function MainNav({ links }) {
  return (
    <nav aria-label="Основна навігація">
      <ul className="nav-list">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MainNav
