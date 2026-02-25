import React, { useState, useEffect, useCallback } from 'react';

const EMPTY_FORM = { name: '', username: '', email: '', password: '', teamId: '' };

function Users() {
  const [users, setUsers]       = useState([]);
  const [teams, setTeams]       = useState([]);
  const [error, setError]       = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);   // the user being edited
  const [form, setForm]         = useState(EMPTY_FORM);

  const codespace_name = process.env.REACT_APP_CODESPACE_NAME;
  const base = codespace_name
    ? `https://${codespace_name}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';

  // ── helpers ──────────────────────────────────────────────────────────────
  const parseMembers = (members) => {
    if (!members) return [];
    if (Array.isArray(members)) return members;
    try { const p = JSON.parse(members); return Array.isArray(p) ? p : []; }
    catch { return []; }
  };

  const getTeamForUser = useCallback((username) => {
    for (const t of teams) {
      if (parseMembers(t.members).includes(username)) return t;
    }
    return null;
  }, [teams]);

  // ── data fetching ─────────────────────────────────────────────────────────
  const fetchAll = useCallback(() => {
    Promise.all([
      fetch(`${base}/users/`).then(r => r.json()),
      fetch(`${base}/teams/`).then(r => r.json()),
    ]).then(([uData, tData]) => {
      setUsers(Array.isArray(uData) ? uData : uData.results || []);
      setTeams(Array.isArray(tData) ? tData : tData.results || []);
    }).catch(err => setError(err.message));
  }, [base]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── modal open / close ────────────────────────────────────────────────────
  const openEdit = (user) => {
    const currentTeam = getTeamForUser(user.username);
    setEditUser(user);
    setForm({
      name:     user.name     || '',
      username: user.username || '',
      email:    user.email    || '',
      password: '',
      teamId:   currentTeam ? currentTeam._id : '',
    });
    setSaveError(null);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditUser(null); };

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      // 1. Update user fields
      const userPayload = { name: form.name, username: form.username, email: form.email };
      if (form.password) userPayload.password = form.password;

      const userRes = await fetch(`${base}/users/${editUser._id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });
      if (!userRes.ok) throw new Error(`User update failed (${userRes.status})`);

      // 2. Update team membership
      const oldTeam = getTeamForUser(editUser.username);
      const newTeamId = form.teamId;
      const oldTeamId = oldTeam ? oldTeam._id : null;

      if (oldTeamId !== newTeamId) {
        // Remove from old team
        if (oldTeam) {
          const members = parseMembers(oldTeam.members).filter(m => m !== editUser.username);
          await fetch(`${base}/teams/${oldTeam._id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: oldTeam.name, members }),
          });
        }
        // Add to new team
        if (newTeamId) {
          const newTeam = teams.find(t => t._id === newTeamId);
          if (newTeam) {
            const members = [...parseMembers(newTeam.members), form.username];
            await fetch(`${base}/teams/${newTeam._id}/`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newTeam.name, members }),
            });
          }
        }
      }

      closeModal();
      fetchAll();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────
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
                  <th>Team</th>
                  <th style={{width:'90px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const team = getTeamForUser(user.username);
                  return (
                    <tr key={user._id || index}>
                      <td className="text-center text-muted">{index + 1}</td>
                      <td><strong>{user.name}</strong></td>
                      <td><code>{user.username}</code></td>
                      <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a></td>
                      <td>
                        {team
                          ? <span className="badge bg-info text-dark">{team.name}</span>
                          : <span className="text-muted small">—</span>}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(user)}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

      {/* ── Edit Modal ── */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{background:'linear-gradient(90deg,#162447,#1f4068)', color:'#4fc3f7'}}>
                <h5 className="modal-title">✏️ Edit User — <code style={{color:'#fff'}}>{editUser.username}</code></h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {saveError && <div className="alert alert-danger">{saveError}</div>}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.username}
                    onChange={e => setForm(f => ({...f, username: e.target.value}))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password <span className="text-muted fw-normal">(leave blank to keep current)</span></label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New password…"
                    value={form.password}
                    onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    className="form-select"
                    value={form.teamId}
                    onChange={e => setForm(f => ({...f, teamId: e.target.value}))}
                  >
                    <option value="">— No team —</option>
                    {teams.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal} disabled={saving}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
