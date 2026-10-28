import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <>
      <header className="header">
        <h1>Карпатські маршрути</h1>
        <nav>
          <a href="#about">Про сервіс</a>
          <a href="#peaks">Вершини</a>
        </nav>
      </header>
      <main>
        <HomePage />
      </main>
    </>
  );
}

export default App;
