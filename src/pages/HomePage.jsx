import PeakCard from "../components/PeakCard.jsx";
import { peaks } from "../data/peaks.js";

function HomePage() {
  return (
    <>
      <section id="about">
        <h2>Про сервіс</h2>
        <p>
          «Карпатські маршрути» допомагають переглянути вершини Українських
          Карпат і спланувати похід.
        </p>
      </section>

      <section id="peaks">
        <h2>Вершини</h2>
        {peaks.length === 0 ? (
          <p>Вершини ще не додано.</p>
        ) : (
          <div className="peak-grid">
            {peaks.map((peak) => (
              <PeakCard key={peak.id} peak={peak} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default HomePage;
