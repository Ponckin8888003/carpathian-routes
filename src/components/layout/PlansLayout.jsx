import { NavLink, Outlet } from 'react-router'

// Вкладена оболонка розділу «Плани походів»: спільне меню для списку й форм.
function PlansLayout() {
  return (
    <>
      <nav aria-label="Навігація розділом планів">
        <ul className="nav-list sub-nav">
          <li>
            <NavLink to="." end>
              Список планів
            </NavLink>
          </li>
          <li>
            <NavLink to="new">Новий план</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
}

export default PlansLayout
