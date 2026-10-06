import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-page-header">
        <h1>🏠 Welkom bij Voetbaltracker</h1>
        <p>Houd je wedstrijden, spelers en statistieken eenvoudig bij.</p>
      </div>

      <div className="home-page-links">
        <Link to="/wedstrijden" className="home-page-card">
          <span>⚽</span>
          <h2>Wedstrijden</h2>
          <p>Bekijk en beheer je wedstrijden.</p>
        </Link>

        <Link to="/spelers" className="home-page-card">
          <span>👥</span>
          <h2>Spelers</h2>
          <p>Bekijk en beheer je spelers.</p>
        </Link>

        <Link to="/dashboard" className="home-page-card">
          <span>📊</span>
          <h2>Dashboard</h2>
          <p>Bekijk je belangrijkste statistieken.</p>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
