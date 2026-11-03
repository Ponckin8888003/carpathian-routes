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
      <p>Оберіть вершину, створіть план походу, а потім відредагуйте або видаліть його.</p>
      <p>
        <Link to="/peaks">Перейти до вершин</Link>
      </p>
      <p>
        <Link to="/plans">Переглянути плани походів</Link>
      </p>
    </>
  )
}

export default HomePage
