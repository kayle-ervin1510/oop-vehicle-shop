import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  return m > 0 ? `${h} hr${h !== 1 ? 's' : ''} and ${m} minutes` : `${h} hr${h !== 1 ? 's' : ''}`
}

function formatTotal(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} minutes`
  if (m === 0) return `${h} hours`
  return `${h} hours and ${m} minutes`
}

export default function ScreenTimePage() {
  const { childId } = useParams()
  const { getChild, toggleStopApp, setChildGoal } = useApp()
  const navigate = useNavigate()
  const child = getChild(childId)
  const [selectedDay, setSelectedDay] = useState(0)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [expandedApp, setExpandedApp] = useState(null)

  if (!child) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <main className="dashboard-main">
          <div className="page">
            <p style={{ color: 'var(--text-secondary)' }}>Child not found.</p>
            <button className="btn btn-ghost mt-2" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  const history = child.screenTimeHistory
  const dayData = history[selectedDay]
  const isToday = selectedDay === 0
  const maxMinutes = Math.max(...dayData.apps.map(a => a.minutes), 1)
  const goalMinutes = child.dailyGoalMinutes
  const goalPct = goalMinutes
    ? Math.min(100, Math.round((dayData.totalMinutes / goalMinutes) * 100))
    : null

  function handleSaveGoal(e) {
    e.preventDefault()
    const hrs = parseFloat(goalInput)
    if (!isNaN(hrs) && hrs > 0) {
      setChildGoal(childId, Math.round(hrs * 60))
    }
    setEditingGoal(false)
    setGoalInput('')
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        <div className="back-row">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <button
            className="back-btn"
            onClick={() => navigate(`/dashboard/${childId}/apps`)}
            style={{ color: 'var(--accent-orange)' }}
          >
            Manage Apps →
          </button>
        </div>

        {/* Day tabs */}
        <div className="day-tabs">
          {history.map((day, i) => (
            <button
              key={day.date}
              className={`day-tab${selectedDay === i ? ' day-tab-active' : ''}`}
              onClick={() => setSelectedDay(i)}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Screen Time Goal */}
        <div className="goal-bar-card">
          <div className="goal-bar-header">
            <span className="goal-bar-label">
              Daily Screen Time Goal
              {goalMinutes && (
                <span className="goal-bar-value">
                  {' '}— {formatTotal(goalMinutes)}
                </span>
              )}
            </span>
            {editingGoal ? (
              <form className="goal-edit-form" onSubmit={handleSaveGoal}>
                <input
                  className="goal-input"
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  placeholder="hours"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="goal-save-btn">Save</button>
                <button type="button" className="goal-cancel-btn" onClick={() => setEditingGoal(false)}>✕</button>
              </form>
            ) : (
              <button className="goal-edit-btn" onClick={() => { setEditingGoal(true); setGoalInput(goalMinutes ? (goalMinutes / 60).toString() : '') }}>
                {goalMinutes ? 'Edit Goal' : '+ Set Goal'}
              </button>
            )}
          </div>
          {goalMinutes ? (
            <div className="goal-progress-wrap">
              <div className="goal-progress-track">
                <div
                  className="goal-progress-fill"
                  style={{
                    width: `${goalPct}%`,
                    background: goalPct >= 100 ? 'var(--error)' : goalPct >= 75 ? 'var(--accent-orange)' : 'var(--accent-teal)',
                  }}
                />
              </div>
              <span className="goal-pct-label" style={{ color: goalPct >= 100 ? 'var(--error)' : 'var(--text-secondary)' }}>
                {goalPct}% of daily goal
                {goalPct >= 100 && ' — limit reached'}
              </span>
            </div>
          ) : (
            <p className="goal-hint">Set a daily screen time goal to track progress against it.</p>
          )}
        </div>

        {/* Over-limit notification */}
        {isToday && goalMinutes && dayData.totalMinutes > goalMinutes && (() => {
          const over = dayData.totalMinutes - goalMinutes
          const h = Math.floor(over / 60)
          const m = over % 60
          const overStr = h > 0 ? `${h} hr${h !== 1 ? 's' : ''}${m > 0 ? ` and ${m} min` : ''}` : `${m} min`
          return (
            <div className="over-limit-banner">
              <span className="over-limit-icon">⚠</span>
              <span className="over-limit-text">
                <strong>{child.name}</strong> is <strong>{overStr}</strong> over their screen time limit.
                {' '}If you did not authorize this, please press <strong>Stop App</strong>.
              </span>
            </div>
          )
        })()}

        {/* Screen time breakdown */}
        <div className="st-card">
          <div className="st-header-label">Screen Time Overview:</div>
          <p className="st-summary">
            <span className="text-orange">{child.name}</span> spent{' '}
            <span className="st-total">{formatTotal(dayData.totalMinutes)}</span> on
            their screen on {dayData.date}.
          </p>

          <div className="st-breakdown-label">Break Down by App</div>

          <ul className="st-app-list">
            {dayData.apps.map(app => {
              const pct = Math.round((app.minutes / maxMinutes) * 100)
              const stopped = isToday && !!child.stoppedApps[app.name]
              const isExpanded = expandedApp === app.name
              const hasHourly = app.hourly && app.hourly.length > 0
              return (
                <li key={app.name} className={`st-app-item${stopped ? ' st-app-stopped' : ''}`}>
                  <div className="st-app-row">
                    <div className="st-app-name-group"
                      style={{ cursor: hasHourly ? 'pointer' : 'default' }}
                      onClick={() => hasHourly && setExpandedApp(isExpanded ? null : app.name)}
                      title={hasHourly ? 'Click to see hourly usage' : undefined}
                    >
                      <span className="st-app-name">{app.name}</span>
                      {stopped && <span className="stopped-badge">Stopped</span>}
                      {hasHourly && (
                        <span className="hourly-toggle-icon">{isExpanded ? '▲' : '▼'}</span>
                      )}
                    </div>
                    <div className="st-app-right">
                      <span className="st-app-time">{formatTime(app.minutes)}</span>
                      {isToday && (
                        <button
                          className={`stop-app-btn${stopped ? ' stop-app-btn-resume' : ''}`}
                          onClick={() => toggleStopApp(childId, app.name)}
                        >
                          {stopped ? 'Resume' : 'Stop App'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="st-bar-track">
                    <div
                      className="st-bar-fill"
                      style={{
                        width: stopped ? '0%' : `${pct}%`,
                        background: barColor(app.minutes),
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  {isExpanded && hasHourly && (
                    <div className="hourly-breakdown">
                      <p className="hourly-breakdown-label">Usage by hour — click a row that looks suspicious</p>
                      {app.hourly.map((slot, i) => {
                        const isLateNight = slot.hour >= 22 || slot.hour <= 5
                        const slotPct = Math.round((slot.minutes / app.minutes) * 100)
                        return (
                          <div key={i} className={`hourly-entry${isLateNight ? ' hourly-entry-warning' : ''}`}>
                            <span className="hourly-label">
                              {isLateNight && <span className="hourly-warn-icon" title="Late night activity">⚠</span>}
                              {slot.label}
                            </span>
                            <div className="hourly-bar-wrap">
                              <div className="hourly-bar-track">
                                <div
                                  className="hourly-bar-fill"
                                  style={{
                                    width: `${slotPct}%`,
                                    background: isLateNight ? 'var(--error)' : barColor(slot.minutes),
                                  }}
                                />
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

          {isToday && (
            <p className="st-footer" style={{ color: 'var(--text-muted)' }}>
              Use <strong style={{ color: 'var(--text-secondary)' }}>Stop App</strong> to immediately block an app that has exceeded its limit.
            </p>
          )}
          {!isToday && (
            <p className="st-footer">Showing screen time for {dayData.date}.</p>
          )}
        </div>
      </main>
    </div>
  )
}
