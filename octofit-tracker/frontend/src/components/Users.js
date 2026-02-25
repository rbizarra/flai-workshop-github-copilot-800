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
    <div className="container mt-4">
      <h2 className="mb-3">Users</h2>
      {error && <div className="alert alert-danger">Error: {error}</div>}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id || index}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && !error && (
        <p className="text-muted">No users found.</p>
      )}
    </div>
  );
}

export default Users;
