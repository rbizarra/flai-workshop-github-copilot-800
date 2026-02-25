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
    if (Array.isArray(exercises)) return exercises;
    try {
      return JSON.parse(exercises);
    } catch {
      return [exercises];
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Workouts</h2>
      {error && <div className="alert alert-danger">Error: {error}</div>}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Exercises</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout, index) => (
            <tr key={workout._id || index}>
              <td>{index + 1}</td>
              <td><strong>{workout.name}</strong></td>
              <td>{workout.description}</td>
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
      {workouts.length === 0 && !error && (
        <p className="text-muted">No workouts found.</p>
      )}
    </div>
  );
}

export default Workouts;
