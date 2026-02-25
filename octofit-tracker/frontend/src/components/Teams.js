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
    <div className="container py-4">
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center gap-2">
          <span className="fs-4">🛡️</span>
          <h2 className="h5 mb-0">Teams</h2>
        </div>
        <div className="card-body p-0">
          {error && <div className="alert alert-danger m-3">Error: {error}</div>}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle octofit-table mb-0">
              <thead>
                <tr>
                  <th style={{width:'50px'}}>#</th>
                  <th>Team Name</th>
                  <th>Members</th>
                  <th style={{width:'120px'}}>Member Count</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => {
                  const memberList = parseMembers(team.members);
                  return (
                    <tr key={team._id || index}>
                      <td className="text-center text-muted">{index + 1}</td>
                      <td><strong>{team.name}</strong></td>
                      <td>
                        {memberList.map((m, i) => (
                          <span key={i} className="badge bg-primary me-1 mb-1">{m}</span>
                        ))}
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary fs-6">{memberList.length}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {teams.length === 0 && !error && (
            <p className="text-muted text-center py-4">No teams found.</p>
          )}
        </div>
        {teams.length > 0 && (
          <div className="card-footer text-muted text-end small">
            {teams.length} team{teams.length !== 1 ? 's' : ''} total
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
