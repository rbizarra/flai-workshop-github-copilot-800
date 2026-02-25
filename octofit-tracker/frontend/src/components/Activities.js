import React, { useState, useEffect } from 'react';

// Parse ISO date string (YYYY-MM-DD) safely without timezone shifting
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  const codespace_name = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace_name
    ? `https://${codespace_name}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    console.log(`Activities: fetching from ${apiUrl}`);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('Activities: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setActivities(items);
      })
      .catch((err) => {
        console.error('Activities: error fetching data', err);
        setError(err.message);
      });
  }, [apiUrl]);

  return (
    <div className="container py-4">
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center gap-2">
          <span className="fs-4">🏃</span>
          <h2 className="h5 mb-0">Activities</h2>
        </div>
        <div className="card-body p-0">
          {error && <div className="alert alert-danger m-3">Error: {error}</div>}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle octofit-table mb-0">
              <thead>
                <tr>
                  <th style={{width:'50px'}}>#</th>
                  <th>Username</th>
                  <th>Activity Type</th>
                  <th>Duration</th>
                  <th>Calories</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={activity._id || index}>
                    <td className="text-center text-muted">{index + 1}</td>
                    <td><code>{activity.username}</code></td>
                    <td><span className="badge bg-primary bg-opacity-75">{activity.activity_type}</span></td>
                    <td>{activity.duration}</td>
                    <td><span className="badge bg-warning text-dark">{activity.calories} kcal</span></td>
                    <td>{formatDate(activity.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activities.length === 0 && !error && (
            <p className="text-muted text-center py-4">No activities found.</p>
          )}
        </div>
        {activities.length > 0 && (
          <div className="card-footer text-muted text-end small">
            {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} logged
          </div>
        )}
      </div>
    </div>
  );
}

export default Activities;
