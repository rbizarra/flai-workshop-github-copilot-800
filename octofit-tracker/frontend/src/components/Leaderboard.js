import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  const codespace_name = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace_name
    ? `https://${codespace_name}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log(`Leaderboard: fetching from ${apiUrl}`);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setEntries(items);
      })
      .catch((err) => {
        console.error('Leaderboard: error fetching data', err);
        setError(err.message);
      });
  }, [apiUrl]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Leaderboard</h2>
      {error && <div className="alert alert-danger">Error: {error}</div>}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry._id || index}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>
                <span className="badge bg-success fs-6">{entry.score}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {entries.length === 0 && !error && (
        <p className="text-muted">No leaderboard entries found.</p>
      )}
    </div>
  );
}

export default Leaderboard;
