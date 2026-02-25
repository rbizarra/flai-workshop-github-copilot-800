import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  const codespace_name = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespace_name
    ? `https://${codespace_name}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';

  useEffect(() => {
    const leaderboardUrl = `${baseUrl}/leaderboard/`;
    const teamsUrl = `${baseUrl}/teams/`;
    const activitiesUrl = `${baseUrl}/activities/`;

    console.log(`Leaderboard: fetching from ${leaderboardUrl}`);
    console.log(`Teams: fetching from ${teamsUrl}`);
    console.log(`Activities: fetching from ${activitiesUrl}`);

    Promise.all([
      fetch(leaderboardUrl).then((r) => r.json()),
      fetch(teamsUrl).then((r) => r.json()),
      fetch(activitiesUrl).then((r) => r.json()),
    ])
      .then(([leaderboardData, teamsData, activitiesData]) => {
        console.log('Leaderboard: fetched data', leaderboardData);
        console.log('Teams: fetched data', teamsData);
        console.log('Activities: fetched data', activitiesData);

        const leaderboardItems = Array.isArray(leaderboardData) ? leaderboardData : leaderboardData.results || [];
        const teamsItems = Array.isArray(teamsData) ? teamsData : teamsData.results || [];
        const activitiesItems = Array.isArray(activitiesData) ? activitiesData : activitiesData.results || [];

        setEntries(leaderboardItems);
        setTeams(teamsItems);
        setActivities(activitiesItems);
      })
      .catch((err) => {
        console.error('Leaderboard: error fetching data', err);
        setError(err.message);
      });
  }, [baseUrl]);

  // Build a lookup: username -> team name
  const getTeamForUser = (username) => {
    for (const team of teams) {
      const members = Array.isArray(team.members)
        ? team.members
        : (() => { try { return JSON.parse(team.members); } catch { return []; } })();
      if (members.includes(username)) return team.name;
    }
    return 'N/A';
  };

  // Build a lookup: username -> total calories
  const getCaloriesForUser = (username) => {
    return activities
      .filter((a) => a.username === username)
      .reduce((sum, a) => sum + (Number(a.calories) || 0), 0);
  };

  const rankClass = (i) => i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';

  return (
    <div className="container py-4">
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center gap-2">
          <span className="fs-4">🏆</span>
          <h2 className="h5 mb-0">Leaderboard</h2>
        </div>
        <div className="card-body p-0">
          {error && <div className="alert alert-danger m-3">Error: {error}</div>}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle octofit-table mb-0">
              <thead>
                <tr>
                  <th style={{width:'70px'}}>Rank</th>
                  <th>Username</th>
                  <th>Team</th>
                  <th>Score</th>
                  <th>Total Calories</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry._id || index}>
                    <td className="text-center">
                      <span className={`rank-badge ${rankClass(index)}`}>{index + 1}</span>
                    </td>
                    <td><code>{entry.username}</code></td>
                    <td>
                      <span className="badge bg-info text-dark">{getTeamForUser(entry.username)}</span>
                    </td>
                    <td>
                      <span className="badge bg-success fs-6">{entry.score}</span>
                    </td>
                    <td>
                      <span className="badge bg-warning text-dark">{getCaloriesForUser(entry.username)} kcal</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {entries.length === 0 && !error && (
            <p className="text-muted text-center py-4">No leaderboard entries found.</p>
          )}
        </div>
        {entries.length > 0 && (
          <div className="card-footer text-muted text-end small">
            {entries.length} competitor{entries.length !== 1 ? 's' : ''} ranked
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
