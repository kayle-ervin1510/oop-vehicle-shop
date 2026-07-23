import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'

function barColor(minutes) {
  if (minutes <= 60) return '#3b82f6'
  if (minutes < 180) return 'var(--accent-orange)'
  return 'var(--error)'
}

function formatTime(minutes) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function formatTotal(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} minutes`
  if (m === 0) return `${h} hours`
  return `${h} hours and ${m} minutes`
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { currentUser, updateParentProfile, changePassword, deleteAccount, parentScreenTime, activityLog } = useApp()

  const [nameForm, setNameForm] = useState({
    firstName: currentUser?.first_name || '',
    preferredName: currentUser?.preferred_name || '',
  })
  const [nameSaved, setNameSaved] = useState(false)
  const [nameError, setNameError] = useState('')

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState(false)

  const [stDay, setStDay] = useState(0)
  const [expandedApp, setExpandedApp] = useState(null)
  const dayData = parentScreenTime[stDay]
  const maxMinutes = Math.max(...dayData.apps.map(a => a.minutes), 1)

  async function handleNameSave(e) {
    e.preventDefault()
    setNameError('')
    if (!nameForm.firstName.trim()) { setNameError('First name is required.'); return }
    await updateParentProfile({ firstName: nameForm.firstName.trim(), preferredName: nameForm.preferredName.trim() })
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2500)
  }

  async function handlePwSave(e) {
    e.preventDefault()
    setPwError('')
    if (pwForm.next.length < 6) { setPwError('New password must be at least 6 characters.'); return }
    if (pwForm.next !== pwForm.confirm) { setPwError('New passwords do not match.'); return }
    const ok = await changePassword(pwForm.current, pwForm.next)
    if (!ok) { setPwError('Current password is incorrect.'); return }
    setPwSaved(true)
    setPwForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwSaved(false), 2500)
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        <div className="back-row">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>

        <div className="profile-grid">
          {/* ── Left column: account settings ── */}
          <div className="profile-left">
            <div className="profile-avatar-block">
              <div className="profile-avatar">
                {(currentUser?.preferred_name || currentUser?.first_name || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="profile-display-name">
                  {currentUser?.preferred_name || currentUser?.first_name}
                </p>
                <p className="profile-username">@{currentUser?.username}</p>
                <p className="profile-email">{currentUser?.email}</p>
              </div>
            </div>

            {/* Edit name */}
            <div className="profile-section">
              <h2 className="profile-section-title">Edit Profile</h2>
              {nameError && <div className="alert alert-error">{nameError}</div>}
              {nameSaved && (
                <div className="alert" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: '1rem' }}>
                  Profile updated!
                </div>
              )}
              <form onSubmit={handleNameSave}>
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" value={nameForm.firstName}
                    onChange={e => setNameForm(f => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Preferred Name</label>
                  <input type="text" value={nameForm.preferredName} placeholder="(optional)"
                    onChange={e => setNameForm(f => ({ ...f, preferredName: e.target.value }))} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Save Changes
                </button>
              </form>
            </div>

            {/* Change password */}
            <div className="profile-section">
              <h2 className="profile-section-title">Change Password</h2>
              {pwError && <div className="alert alert-error">{pwError}</div>}
              {pwSaved && (
                <div className="alert" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: '1rem' }}>
                  Password changed!
                </div>
              )}
              <form onSubmit={handlePwSave}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" value={pwForm.current} placeholder="Enter current password"
                    onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" value={pwForm.next} placeholder="Min. 6 characters"
                    onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" value={pwForm.confirm} placeholder="Re-enter new password"
                    onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Update Password
                </button>
              </form>
            </div>
          </div>

          {/* ── Right column: parent's own screen time ── */}
          <div className="profile-right">
            <h2 className="profile-section-title" style={{ marginBottom: '1rem' }}>My Screen Time</h2>
            <div className="day-tabs" style={{ marginBottom: '1rem' }}>
              {parentScreenTime.map((day, i) => (
                <button
                  key={day.date}
                  className={`day-tab${stDay === i ? ' day-tab-active' : ''}`}
                  onClick={() => setStDay(i)}
                >
                  {day.label}
                </button>
              ))}
            </div>

            <div className="st-card" style={{ maxWidth: '100%' }}>
              <div className="st-header-label">Screen Time Overview:</div>
              <p className="st-summary">
                You spent <span className="st-total">{formatTotal(dayData.totalMinutes)}</span> on
                your screen on {dayData.date}.
              </p>
              <div className="st-breakdown-label">Break Down by App</div>
              <ul className="st-app-list">
                {dayData.apps.map(app => {
                  const pct = Math.round((app.minutes / maxMinutes) * 100)
                  const isExpanded = expandedApp === app.name
                  const hasHourly = app.hourly && app.hourly.length > 0
                  return (
                    <li key={app.name} className="st-app-item">
                      <div className="st-app-row">
                        <div
                          className="st-app-name-group"
                          style={{ cursor: hasHourly ? 'pointer' : 'default' }}
                          onClick={() => hasHourly && setExpandedApp(isExpanded ? null : app.name)}
                        >
                          <span className="st-app-name">{app.name}</span>
                          {hasHourly && (
                            <span className="hourly-toggle-icon">{isExpanded ? '▲' : '▼'}</span>
                          )}
                        </div>
                        <span className="st-app-time">{formatTime(app.minutes)}</span>
                      </div>
                      <div className="st-bar-track">
                        <div className="st-bar-fill" style={{
                          width: `${pct}%`,
                          background: barColor(app.minutes),
                        }} />
                      </div>
                      {isExpanded && hasHourly && (
                        <div className="hourly-breakdown">
                          <p className="hourly-breakdown-label">Usage by hour</p>
                          {app.hourly.map((slot, i) => {
                            const isLateNight = slot.hour >= 22 || slot.hour <= 5
                            const slotPct = Math.round((slot.minutes / app.minutes) * 100)
                            return (
                              <div key={i} className={`hourly-entry${isLateNight ? ' hourly-entry-warning' : ''}`}>
                                <span className="hourly-label">
                                  {isLateNight && <span className="hourly-warn-icon">⚠</span>}
                                  {slot.label}
                                </span>
                                <div className="hourly-bar-wrap">
                                  <div className="hourly-bar-track">
                                    <div className="hourly-bar-fill" style={{
                                      width: `${slotPct}%`,
                                      background: isLateNight ? 'var(--error)' : barColor(slot.minutes),
                                    }} />
                                  </div>
                                </div>
                                <span className="hourly-time">{slot.minutes} min</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
              <p className="st-footer">Showing screen time for {dayData.date}.</p>
            </div>
          </div>
        </div>

        {/* ── Activity Log ── */}
        <div className="activity-log-section">
          <h2 className="activity-log-title">Activity Log</h2>
          <p className="activity-log-subtitle">
            A record of every app permission change on your account. Use this to detect unauthorized changes.
          </p>

          {activityLog.length === 0 ? (
            <div className="activity-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, marginBottom: '0.5rem' }}>
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <line x1="9" y1="12" x2="15" y2="12"/>
                <line x1="9" y1="16" x2="13" y2="16"/>
              </svg>
              <p>No activity recorded yet. Changes you make to app restrictions will appear here.</p>
            </div>
          ) : (
            <ul className="activity-list">
              {activityLog.map(entry => (
                <li key={entry.id} className="activity-entry">
                  <div className="activity-entry-dot" />
                  <div className="activity-entry-body">
                    <span className="activity-entry-action">{entry.action}.</span>
                    <span className="activity-entry-time">{entry.date} at {entry.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* ── Danger Zone ── */}
        <div className="danger-zone" style={{ marginTop: '1.5rem' }}>
          <p className="danger-zone-title">Danger Zone</p>
          <p className="danger-zone-desc">
            Permanently delete your account and all associated child data. This action cannot be undone.
          </p>
          {confirmDelete ? (
            <div className="danger-confirm-box">
              <p>Are you sure? All your data and your children&rsquo;s profiles will be erased permanently.</p>
              <button className="btn-danger-confirm" onClick={async () => { await deleteAccount(); navigate('/login') }}>
                Yes, Delete My Account
              </button>
              <button className="goal-cancel-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          ) : (
            <button className="btn-danger" onClick={() => setConfirmDelete(true)}>
              Delete My Account
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
