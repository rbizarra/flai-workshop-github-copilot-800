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
    if (!members) return [];
    if (Array.isArray(members)) return members;
    if (typeof members === 'string') {
      try {
        const parsed = JSON.parse(members);
        return Array.isArray(parsed) ? parsed : [members];
      } catch {
        return [members];
      }
    }
    return [];
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
            <th>Member Count</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => {
            const memberList = parseMembers(team.members);
            return (
              <tr key={team._id || index}>
                <td>{index + 1}</td>
                <td>{team.name}</td>
                <td>
                  {memberList.map((m, i) => (
                    <span key={i} className="badge bg-primary me-1">{m}</span>
                  ))}
                </td>
                <td>
                  <span className="badge bg-secondary">{memberList.length}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {teams.length === 0 && !error && (
        <p className="text-muted">No teams found.</p>
      )}
    </div>
  );
}

export default Teams;
