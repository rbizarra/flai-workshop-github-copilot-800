import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);

  const codespace_name = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace_name
    ? `https://${codespace_name}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log(`Workouts: fetching from ${apiUrl}`);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('Workouts: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
      })
      .catch((err) => {
        console.error('Workouts: error fetching data', err);
        setError(err.message);
      });
  }, [apiUrl]);

  const parseExercises = (exercises) => {
    if (!exercises) return [];
    let list;
    if (Array.isArray(exercises)) {
      list = exercises;
    } else if (typeof exercises === 'string') {
      try { list = JSON.parse(exercises); } catch { return [exercises]; }
    } else {
      return [];
    }
    // Guard: Djongo can return objects instead of strings
    return list.map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        const vals = Object.values(item);
        return vals.length > 0 ? String(vals[0]) : JSON.stringify(item);
      }
      return String(item);
    });
  };

  return (
    <div className="container py-4">
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center gap-2">
          <span className="fs-4">🏋️</span>
          <h2 className="h5 mb-0">Workouts</h2>
        </div>
        <div className="card-body p-0">
          {error && <div className="alert alert-danger m-3">Error: {error}</div>}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle octofit-table mb-0">
              <thead>
                <tr>
                  <th style={{width:'50px'}}>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Exercises</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, index) => (
                  <tr key={workout._id || index}>
                    <td className="text-center text-muted">{index + 1}</td>
                    <td><strong>{workout.name}</strong></td>
                    <td className="text-muted">{workout.description}</td>
                    <td>
                      <ul className="mb-0 ps-3">
                        {parseExercises(workout.exercises).map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {workouts.length === 0 && !error && (
            <p className="text-muted text-center py-4">No workouts found.</p>
          )}
        </div>
        {workouts.length > 0 && (
          <div className="card-footer text-muted text-end small">
            {workouts.length} workout{workouts.length !== 1 ? 's' : ''} available
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
