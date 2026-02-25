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

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Leaderboard</h2>
      {error && <div className="alert alert-danger">Error: {error}</div>}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Team</th>
            <th>Score</th>
            <th>Total Calories</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry._id || index}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
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
      {entries.length === 0 && !error && (
        <p className="text-muted">No leaderboard entries found.</p>
      )}
    </div>
  );
}

export default Leaderboard;
