import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'

function ChildCard({ child }) {
  const navigate = useNavigate()
  const { removeChild, updateChildName } = useApp()
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(child.name)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const restrictedCount = child.apps.timeRestricted.length
  const unlimitedCount = child.apps.timeUnlimited.length
  const unauthorizedCount = child.apps.unauthorized.length

  function handleSaveName(e) {
    e.preventDefault()
    if (editName.trim()) {
      updateChildName(child.id, editName.trim())
    }
    setEditing(false)
  }

  return (
    <div className="child-card">
      {/* Card actions top-right */}
      <div className="child-card-top-actions">
        <button
          className="icon-btn icon-btn-edit"
          title="Edit name"
          onClick={() => { setEditing(true); setEditName(child.name) }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          className="icon-btn icon-btn-delete"
          title="Remove child"
          onClick={() => setConfirmDelete(true)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>

      <div className="child-card-avatar">
        {child.name.charAt(0).toUpperCase()}
      </div>

      {/* Inline name edit */}
      {editing ? (
        <form onSubmit={handleSaveName} className="edit-name-form">
          <input
            className="edit-name-input"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            autoFocus
            maxLength={40}
          />
          <div className="edit-name-actions">
            <button type="submit" className="edit-name-save">Save</button>
            <button type="button" className="edit-name-cancel" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <h3 className="child-card-name">{child.name}</h3>
      )}

      {/* Confirm delete overlay */}
      {confirmDelete && (
        <div className="confirm-delete">
          <p>Remove <strong>{child.name}</strong>?</p>
          <div className="confirm-delete-actions">
            <button className="confirm-yes" onClick={() => removeChild(child.id)}>Remove</button>
            <button className="confirm-no" onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        </div>
      )}

      {!confirmDelete && !editing && (
        <>
          <div className="child-card-stats">
            <div className="stat">
              <span className="stat-number" style={{ color: 'var(--accent-orange)' }}>
                {restrictedCount}
              </span>
              <span className="stat-label">Time-Restricted</span>
            </div>
            <div className="stat">
              <span className="stat-number" style={{ color: 'var(--accent-teal)' }}>
                {unlimitedCount}
              </span>
              <span className="stat-label">Unlimited</span>
            </div>
            <div className="stat">
              <span className="stat-number" style={{ color: 'var(--error)' }}>
                {unauthorizedCount}
              </span>
              <span className="stat-label">Blocked</span>
            </div>
          </div>

          <div className="child-card-actions">
            <button
              className="btn btn-teal"
              onClick={() => navigate(`/dashboard/${child.id}/overview`)}
            >
              Screen Time
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate(`/dashboard/${child.id}/apps`)}
            >
              Manage Apps
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { children, currentUser } = useApp()

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        {/* ── Prototype notice ── */}
        <div style={{
          background: 'rgba(240, 89, 42, 0.08)',
          border: '1px solid rgba(240, 89, 42, 0.35)',
          borderRadius: '10px',
          padding: '0.85rem 1.1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '1.1rem', lineHeight: 1, marginTop: '0.05rem' }}>🚧</span>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: 'var(--accent-orange)' }}>Prototype notice:</strong>{' '}
            Zap App is currently a prototype and does not yet actually track users&rsquo; time
            on the internet or on specific apps. The screen-time data shown is simulated.
            The creator has not yet learned how to integrate real device tracking into the
            app &mdash; that feature is planned for a future release.
          </p>
        </div>

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Welcome back,{' '}
              <span className="text-orange">
                {currentUser?.preferred_name || currentUser?.first_name}
              </span>
            </h1>
            <p className="dashboard-subtitle">
              {children.length === 0
                ? 'Add your first child profile to get started.'
                : `Managing ${children.length} child profile${children.length !== 1 ? 's' : ''}.`}
            </p>
          </div>
          <button
            className="btn btn-primary btn-add-child"
            onClick={() => navigate('/dashboard/new-child')}
          >
            + Add Child
          </button>
        </div>

        {children.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="20" r="11" stroke="var(--accent-orange)" strokeWidth="2.5" fill="none"/>
                <circle cx="14" cy="26" r="8" stroke="var(--text-muted)" strokeWidth="2" fill="none"/>
                <circle cx="50" cy="26" r="8" stroke="var(--text-muted)" strokeWidth="2" fill="none"/>
                <path d="M6 54c0-8 5.4-12 12-12" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M58 54c0-8-5.4-12-12-12" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M16 54c0-9.9 7.2-16 16-16s16 6.1 16 16" stroke="var(--accent-orange)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <h2 className="empty-title">No child profiles yet</h2>
            <p className="empty-desc">
              Create a child profile to start managing their screen time and app access.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: 'auto', padding: '0.7rem 2rem' }}
              onClick={() => navigate('/dashboard/new-child')}
            >
              + Add Your First Child
            </button>
          </div>
        ) : (
          <div className="child-grid">
            {children.map(child => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
