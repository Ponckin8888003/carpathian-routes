import AppLayout from "./components/layout/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import PlanPage from "./pages/PlanPage.jsx";
import { peaks } from "./data/peaks.js";

const navigationLinks = [
  { href: "#about", label: "Про сервіс" },
  { href: "#peaks", label: "Вершини" },
  { href: "#plan", label: "План походу" },
];

function App() {
  const examplePeak = peaks.find((peak) => peak.id === 1);

  return (
    <AppLayout title="Карпатські маршрути" links={navigationLinks}>
      <HomePage />
      <PlanPage peak={examplePeak} />
    </AppLayout>
  );
}

export default App;
