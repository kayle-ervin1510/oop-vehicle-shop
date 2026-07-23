import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'

export default function EditParamsPage() {
  const { childId, appName } = useParams()
  const { getChild, updateAppRestriction } = useApp()
  const navigate = useNavigate()

  const child = getChild(childId)
  const decodedApp = decodeURIComponent(appName)
  const appData = child?.apps.timeRestricted.find(a => a.name === decodedApp)

  const [form, setForm] = useState({
    hours: appData?.hours ?? 1,
    minutes: appData?.minutes ?? 0,
    requirePassword: appData?.requirePassword ?? false,
    requireEmail: appData?.requireEmail ?? false,
  })
  const [saved, setSaved] = useState(false)

  if (!child || !appData) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <main className="dashboard-main">
          <div className="page">
            <p style={{ color: 'var(--text-secondary)' }}>App not found.</p>
            <button className="btn btn-ghost mt-2" onClick={() => navigate('/dashboard')}>
              ← Back
            </button>
          </div>
        </main>
      </div>
    )
  }

  function handleConfirm(e) {
    e.preventDefault()
    updateAppRestriction(child.id, decodedApp, {
      hours: Number(form.hours),
      minutes: Number(form.minutes),
      requirePassword: form.requirePassword,
      requireEmail: form.requireEmail,
    })
    setSaved(true)
    setTimeout(() => navigate(`/dashboard/${childId}/apps`), 900)
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        <div className="back-row">
          <button
            className="back-btn"
            onClick={() => navigate(`/dashboard/${childId}/apps`)}
          >
            ← Manage Apps
          </button>
        </div>

        <div className="page" style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '1rem' }}>
          <div className="card">
            <p className="page-title">
              Editing Restrictions on{' '}
              <span className="text-orange">{decodedApp}</span>
            </p>
            <p className="page-subtitle">
              For {child.name}&rsquo;s profile.
            </p>

            {saved && (
              <div
                className="alert"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: 'var(--success)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  marginBottom: '1rem',
                }}
              >
                Changes saved! Returning…
              </div>
            )}

            <form onSubmit={handleConfirm}>
              {/* Time restriction */}
              <div className="edit-section">
                <label className="edit-section-label">Time Restriction</label>
                <div className="time-inputs">
                  <div className="time-field">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={form.hours}
                      onChange={e => setForm(f => ({ ...f, hours: e.target.value }))}
                      className="time-number-input"
                    />
                    <span className="time-unit">hrs</span>
                  </div>
                  <div className="time-field">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={form.minutes}
                      onChange={e => setForm(f => ({ ...f, minutes: e.target.value }))}
                      className="time-number-input"
                    />
                    <span className="time-unit">min</span>
                  </div>
                </div>
                <p className="field-hint">
                  Child will receive a 5-minute warning before time runs out.
                </p>
              </div>

              <hr className="divider" />

              {/* Access restrictions */}
              <div className="edit-section">
                <label className="edit-section-label">Restrict Access</label>

                <label
                  className="checkbox-group"
                  style={{ marginBottom: '0.75rem' }}
                  onClick={() =>
                    setForm(f => ({ ...f, requirePassword: !f.requirePassword }))
                  }
                >
                  <input
                    type="checkbox"
                    checked={form.requirePassword}
                    onChange={() =>
                      setForm(f => ({ ...f, requirePassword: !f.requirePassword }))
                    }
                    onClick={e => e.stopPropagation()}
                  />
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      Parental Password Required
                    </strong>
                    <br />
                    <span style={{ fontSize: '0.8rem' }}>
                      Child must enter your password before opening this app.
                    </span>
                  </span>
                </label>

                <label
                  className="checkbox-group"
                  onClick={() =>
                    setForm(f => ({ ...f, requireEmail: !f.requireEmail }))
                  }
                >
                  <input
                    type="checkbox"
                    checked={form.requireEmail}
                    onChange={() =>
                      setForm(f => ({ ...f, requireEmail: !f.requireEmail }))
                    }
                    onClick={e => e.stopPropagation()}
                  />
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      Parental Email Verification Required
                    </strong>
                    <br />
                    <span style={{ fontSize: '0.8rem' }}>
                      You will receive an email confirmation request when your child
                      tries to open this app.
                    </span>
                  </span>
                </label>
              </div>

              <hr className="divider" />

              {/* Unauthorized */}
              <div className="edit-section">
                <label className="edit-section-label">Unauthorized Apps</label>
                <p className="field-hint" style={{ marginBottom: '0.75rem' }}>
                  Blocked apps are managed from the{' '}
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-orange)',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'inherit',
                      padding: 0,
                    }}
                    onClick={() => navigate(`/dashboard/${childId}/apps`)}
                  >
                    Manage Apps
                  </button>{' '}
                  page.
                </p>
                <div className="apps-tag-list">
                  {child.apps.unauthorized.length === 0 ? (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      No blocked apps for {child.name}.
                    </span>
                  ) : (
                    child.apps.unauthorized.map(app => (
                      <span key={app.id ?? app.name} className="app-pill app-pill-red">
                        {app.name}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saved}>
                Confirm Edits
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
