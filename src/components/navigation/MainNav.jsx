import { NavLink } from 'react-router'

// links: масив { to, label, end }. NavLink сам додає aria-current="page" активному пункту.
function MainNav({ links }) {
  return (
    <nav aria-label="Основна навігація">
      <ul className="nav-list">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MainNav
