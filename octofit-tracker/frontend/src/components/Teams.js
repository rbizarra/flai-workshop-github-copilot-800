import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  const codespace_name = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace_name
    ? `https://${codespace_name}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log(`Teams: fetching from ${apiUrl}`);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('Teams: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
      })
      .catch((err) => {
        console.error('Teams: error fetching data', err);
        setError(err.message);
      });
  }, [apiUrl]);

  const parseMembers = (members) => {
    if (Array.isArray(members)) return members;
    try {
      return JSON.parse(members);
    } catch {
      return [members];
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Teams</h2>
      {error && <div className="alert alert-danger">Error: {error}</div>}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Team Name</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={team._id || index}>
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>
                {parseMembers(team.members).map((m, i) => (
                  <span key={i} className="badge bg-primary me-1">{m}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {teams.length === 0 && !error && (
        <p className="text-muted">No teams found.</p>
      )}
    </div>
  );
}

export default Teams;
