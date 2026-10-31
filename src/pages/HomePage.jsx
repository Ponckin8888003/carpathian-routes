import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'

function HomePage() {
  return (
    <>
      <PageHeading title="Карпатські маршрути" />
      <p>
        Сервіс допомагає переглянути вершини Українських Карпат і спланувати
        похід.
      </p>
      <p>Перегляньте вершини та підготуйте чернетку плану походу.</p>
      <p>
        <Link to="/peaks">Перейти до вершин</Link>
      </p>
      <p>
        <Link to="/plans">Переглянути демонстраційні плани</Link>
      </p>
    </>
  )
}

export default HomePage
