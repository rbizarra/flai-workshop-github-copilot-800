import React, { useState, useEffect } from 'react';

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
    <div className="container mt-4">
      <h2 className="mb-3">Activities</h2>
      {error && <div className="alert alert-danger">Error: {error}</div>}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Activity Type</th>
            <th>Duration</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={activity._id || index}>
              <td>{index + 1}</td>
              <td>{activity.username}</td>
              <td>{activity.activity_type}</td>
              <td>{activity.duration}</td>
              <td>{activity.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {activities.length === 0 && !error && (
        <p className="text-muted">No activities found.</p>
      )}
    </div>
  );
}

export default Activities;
