function PeakCard({ peak }) {
  return (
    <article className="peak-card">
      <h3>{peak.name}</h3>
      <p className="meta">
        {peak.heightM} м · {peak.massif}
      </p>
      <p>{peak.description}</p>
      <p className="status">
        {peak.hasRoutes ? "Маршрути додано" : "Маршрутів ще немає"}
      </p>
    </article>
  );
}

export default PeakCard;
