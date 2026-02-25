import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const codespace_name = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace_name
    ? `https://${codespace_name}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  useEffect(() => {
    console.log(`Users: fetching from ${apiUrl}`);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('Users: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setUsers(items);
      })
      .catch((err) => {
        console.error('Users: error fetching data', err);
        setError(err.message);
      });
  }, [apiUrl]);

  return (
    <div className="container py-4">
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center gap-2">
          <span className="fs-4">👥</span>
          <h2 className="h5 mb-0">Users</h2>
        </div>
        <div className="card-body p-0">
          {error && <div className="alert alert-danger m-3">Error: {error}</div>}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle octofit-table mb-0">
              <thead>
                <tr>
                  <th style={{width:'50px'}}>#</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id || index}>
                    <td className="text-center text-muted">{index + 1}</td>
                    <td><strong>{user.name}</strong></td>
                    <td><code>{user.username}</code></td>
                    <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && !error && (
            <p className="text-muted text-center py-4">No users found.</p>
          )}
        </div>
        {users.length > 0 && (
          <div className="card-footer text-muted text-end small">
            {users.length} user{users.length !== 1 ? 's' : ''} total
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
