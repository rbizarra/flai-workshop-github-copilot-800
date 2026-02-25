import './App.css';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark octofit-navbar">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img
              src={process.env.PUBLIC_URL + '/octofitapp-small.png'}
              alt="OctoFit Logo"
            />
            <span className="brand-text">OctoFit Tracker</span>
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
            <div>
              <div className="hero-section text-center mb-4">
                <h1 className="display-4 fw-bold mb-3">💪 OctoFit Tracker</h1>
                <p className="lead">Track your fitness activities, compete with your team, and stay in shape!</p>
              </div>
              <div className="row g-4">
                <div className="col-sm-6 col-lg-4">
                  <Link to="/users" className="text-decoration-none">
                    <div className="card octofit-card h-100 text-center p-3">
                      <div className="card-body">
                        <div className="fs-1 mb-3">👥</div>
                        <h5 className="card-title fw-bold">Users</h5>
                        <p className="card-text text-muted">View all registered heroes and their profiles.</p>
                      </div>
                      <div className="card-footer">
                        <span className="btn btn-primary btn-sm w-100">Go to Users →</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-lg-4">
                  <Link to="/activities" className="text-decoration-none">
                    <div className="card octofit-card h-100 text-center p-3">
                      <div className="card-body">
                        <div className="fs-1 mb-3">🏃</div>
                        <h5 className="card-title fw-bold">Activities</h5>
                        <p className="card-text text-muted">Browse logged workouts, durations, and calories burned.</p>
                      </div>
                      <div className="card-footer">
                        <span className="btn btn-primary btn-sm w-100">Go to Activities →</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-lg-4">
                  <Link to="/leaderboard" className="text-decoration-none">
                    <div className="card octofit-card h-100 text-center p-3">
                      <div className="card-body">
                        <div className="fs-1 mb-3">🏆</div>
                        <h5 className="card-title fw-bold">Leaderboard</h5>
                        <p className="card-text text-muted">See who's leading the fitness race across all teams.</p>
                      </div>
                      <div className="card-footer">
                        <span className="btn btn-warning btn-sm w-100">Go to Leaderboard →</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-lg-4">
                  <Link to="/teams" className="text-decoration-none">
                    <div className="card octofit-card h-100 text-center p-3">
                      <div className="card-body">
                        <div className="fs-1 mb-3">🛡️</div>
                        <h5 className="card-title fw-bold">Teams</h5>
                        <p className="card-text text-muted">Explore team rosters and their superhero members.</p>
                      </div>
                      <div className="card-footer">
                        <span className="btn btn-info btn-sm w-100">Go to Teams →</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-lg-4">
                  <Link to="/workouts" className="text-decoration-none">
                    <div className="card octofit-card h-100 text-center p-3">
                      <div className="card-body">
                        <div className="fs-1 mb-3">🏋️</div>
                        <h5 className="card-title fw-bold">Workouts</h5>
                        <p className="card-text text-muted">Discover personalized workout plans for every hero.</p>
                      </div>
                      <div className="card-footer">
                        <span className="btn btn-success btn-sm w-100">Go to Workouts →</span>
                      </div>
                    </div>
                  </Link>
                </div>
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
