import './App.css';
import { Routes, Route, NavLink } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img
              src={process.env.PUBLIC_URL + '/octofit-logo.png'}
              alt="OctoFit"
              height="30"
              className="me-2"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/activities">Activities</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/teams">Teams</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">Users</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/workouts">Workouts</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <Routes>
          <Route path="/" element={
            <div className="hero-section text-center">
              <h1 className="display-4 fw-bold mb-3">💪 OctoFit Tracker</h1>
              <p className="lead mb-4">Track your fitness activities, compete with your team, and stay in shape!</p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <a href="/activities" className="btn btn-light hero-nav-btn">Activities</a>
                <a href="/leaderboard" className="btn btn-warning hero-nav-btn">Leaderboard</a>
                <a href="/teams" className="btn btn-info hero-nav-btn">Teams</a>
                <a href="/users" className="btn btn-light hero-nav-btn">Users</a>
                <a href="/workouts" className="btn btn-success hero-nav-btn">Workouts</a>
              </div>
            </div>
          } />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
