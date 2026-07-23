import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'

function XBtn({ onClick, label }) {
  return (
    <button className="x-btn" onClick={e => { e.stopPropagation(); onClick() }}
      title={`Remove ${label}`} aria-label={`Remove ${label}`}>✕</button>
  )
}

function AddAppInput({ onAdd, placeholder }) {
  const [value, setValue] = useState('')
  function submit(e) {
    e.preventDefault()
    if (value.trim()) { onAdd(value); setValue('') }
  }
  return (
    <form className="add-app-form" onSubmit={submit}>
      <input className="add-app-input" value={value}
        onChange={e => setValue(e.target.value)} placeholder={placeholder} />
      <button type="submit" className="add-app-btn">+ Add</button>
    </form>
  )
}

function SectionCard({ title, color, children }) {
  return (
    <div className="apps-section">
      <h2 className="apps-section-title" style={{ color }}>{title}</h2>
      {children}
    </div>
  )
}

// ── Device verification flow ──
// Steps: 'idle' | 'name' | 'method' | 'phone-entry' | 'phone-code' | 'install' | 'done'
function DeviceVerifyFlow({ onAdd, onCancel }) {
  const [step, setStep] = useState('name')
  const [deviceName, setDeviceName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  function handleNameSubmit(e) {
    e.preventDefault()
    if (deviceName.trim()) setStep('method')
  }

  function handleCodeSubmit(e) {
    e.preventDefault()
    if (code.trim().length < 4) { setCodeError('Enter the 4-digit code sent to the device.'); return }
    onAdd(deviceName)
    setStep('done')
    setTimeout(onCancel, 1200)
  }

  function handleInstallConfirm() {
    onAdd(deviceName)
    setStep('done')
    setTimeout(onCancel, 1200)
  }

  return (
    <div className="device-verify-box">
      {step === 'name' && (
        <form onSubmit={handleNameSubmit}>
          <p className="device-verify-title">Connect a Device</p>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Device Name</label>
            <input type="text" className="add-app-input" style={{ width: '100%' }}
              value={deviceName} onChange={e => setDeviceName(e.target.value)}
              placeholder="e.g. Alex's iPad" autoFocus />
          </div>
          <div className="device-verify-actions">
            <button type="submit" className="add-app-btn" disabled={!deviceName.trim()}>Next →</button>
            <button type="button" className="goal-cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      )}

      {step === 'method' && (
        <div>
          <p className="device-verify-title">Verify <span style={{ color: 'var(--accent-orange)' }}>{deviceName}</span></p>
          <p className="field-hint" style={{ marginBottom: '1rem' }}>
            Choose how to verify this device to prevent unauthorized access.
          </p>
          <div className="method-options">
            <button className="method-btn" onClick={() => setStep('phone-entry')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <div>
                <strong>Enter Child's Phone Number</strong>
                <p>A verification code will be sent to the device.</p>
              </div>
            </button>
            <button className="method-btn" onClick={() => setStep('install')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <div>
                <strong>Install Zap App on Device</strong>
                <p>Download and install Zap App on your child's device.</p>
              </div>
            </button>
          </div>
          <button className="goal-cancel-btn" style={{ marginTop: '0.75rem' }} onClick={() => setStep('name')}>← Back</button>
        </div>
      )}

      {step === 'phone-entry' && (
        <form onSubmit={e => { e.preventDefault(); setStep('phone-code') }}>
          <p className="device-verify-title">Enter Child's Phone Number</p>
          <p className="field-hint" style={{ marginBottom: '0.75rem' }}>
            A 4-digit verification code will be sent to this number.
          </p>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Phone Number</label>
            <input type="tel" className="add-app-input" style={{ width: '100%' }}
              value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="555-867-5309" autoFocus />
          </div>
          <div className="device-verify-actions">
            <button type="submit" className="add-app-btn" disabled={!phone.trim()}>Send Code</button>
            <button type="button" className="goal-cancel-btn" onClick={() => setStep('method')}>← Back</button>
          </div>
        </form>
      )}

      {step === 'phone-code' && (
        <form onSubmit={handleCodeSubmit}>
          <p className="device-verify-title">Enter Verification Code</p>
          <p className="field-hint" style={{ marginBottom: '0.75rem' }}>
            A code was sent to <strong style={{ color: 'var(--text-primary)' }}>{phone}</strong>. Enter it below to confirm.
          </p>
          {codeError && <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>{codeError}</div>}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Verification Code</label>
            <input type="text" className="add-app-input code-input" style={{ width: '100%' }}
              value={code} onChange={e => { setCode(e.target.value); setCodeError('') }}
              placeholder="• • • •" maxLength={6} autoFocus />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Hint: any 4+ character code works in this demo.
          </p>
          <div className="device-verify-actions">
            <button type="submit" className="add-app-btn">Verify →</button>
            <button type="button" className="goal-cancel-btn" onClick={() => setStep('phone-entry')}>← Back</button>
          </div>
        </form>
      )}

      {step === 'install' && (
        <div>
          <p className="device-verify-title">Install Zap App on {deviceName}</p>
          <div className="install-steps">
            <div className="install-step">
              <span className="install-step-num">1</span>
              <p>On the child's device, open the <strong>App Store</strong> or <strong>Google Play</strong>.</p>
            </div>
            <div className="install-step">
              <span className="install-step-num">2</span>
              <p>Search for <strong style={{ color: 'var(--accent-orange)' }}>Zap App</strong> and install it.</p>
            </div>
            <div className="install-step">
              <span className="install-step-num">3</span>
              <p>Open Zap App on the child's device and enter your <strong>parent account email</strong> to link it.</p>
            </div>
          </div>
          <div className="device-verify-actions" style={{ marginTop: '1rem' }}>
            <button className="add-app-btn" onClick={handleInstallConfirm}>Mark as Installed ✓</button>
            <button className="goal-cancel-btn" onClick={() => setStep('method')}>← Back</button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: '1rem' }}>
            ✓ {deviceName} connected!
          </p>
        </div>
      )}
    </div>
  )
}

export default function ManageAppsPage() {
  const { childId } = useParams()
  const { getChild, removeApp, addApp, addDevice, removeDevice } = useApp()
  const navigate = useNavigate()
  const child = getChild(childId)
  const [showVerify, setShowVerify] = useState(false)

  if (!child) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <main className="dashboard-main">
          <div className="page">
            <p style={{ color: 'var(--text-secondary)' }}>Child not found.</p>
          </div>
        </main>
      </div>
    )
  }

  const { apps, devices } = child

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        <div className="back-row">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <button className="back-btn" onClick={() => navigate(`/dashboard/${childId}/overview`)}
            style={{ color: 'var(--accent-teal)' }}>Screen Time →</button>
        </div>

        <div className="manage-header">
          <div className="child-card-avatar" style={{ width: 48, height: 48, fontSize: '1.3rem' }}>
            {child.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="dashboard-title" style={{ fontSize: '1.6rem' }}>{child.name}&rsquo;s Apps</h1>
            <p className="dashboard-subtitle">Tap a time-restricted app to edit its parameters.</p>
          </div>
        </div>

        <div className="apps-sections">
          {/* Time-Restricted */}
          <SectionCard title="Time-Restricted Apps" color="var(--accent-orange)">
            {apps.timeRestricted.length === 0
              ? <p className="apps-empty">No time-restricted apps added.</p>
              : apps.timeRestricted.map(app => (
                <div key={app.name} className="app-row-wrapper">
                  <div className="app-row" style={{ flex: 1 }}
                    onClick={() => navigate(`/dashboard/${childId}/edit/${encodeURIComponent(app.name)}`)}>
                    <div className="app-row-info">
                      <span className="app-row-name">{app.name}</span>
                      <div className="app-row-meta">
                        <span className="app-tag">{app.hours}h {app.minutes}m limit</span>
                        {app.requirePassword && <span className="app-tag app-tag-orange">Password req.</span>}
                        {app.requireEmail && <span className="app-tag app-tag-orange">Email req.</span>}
                      </div>
                    </div>
                    <span className="app-row-edit">Edit →</span>
                  </div>
                  <XBtn onClick={() => removeApp(childId, 'timeRestricted', app.name)} label={app.name} />
                </div>
              ))
            }
            <AddAppInput placeholder="Add an app (e.g. TikTok)"
              onAdd={name => addApp(childId, 'timeRestricted', name)} />
          </SectionCard>

          {/* Time-Unlimited */}
          <SectionCard title="Time-Unlimited Apps" color="var(--accent-teal)">
            {apps.timeUnlimited.length > 0 && (
              <div className="apps-tag-list" style={{ marginBottom: '0.75rem' }}>
                {apps.timeUnlimited.map(app => (
                  <span key={app.id ?? app.name} className="app-pill app-pill-teal">
                    {app.name}
                    <XBtn onClick={() => removeApp(childId, 'timeUnlimited', app.name)} label={app.name} />
                  </span>
                ))}
              </div>
            )}
            {apps.timeUnlimited.length === 0 && <p className="apps-empty">No unlimited apps added.</p>}
            <AddAppInput placeholder="Add an app (e.g. Khan Academy)"
              onAdd={name => addApp(childId, 'timeUnlimited', name)} />
          </SectionCard>

          {/* Unauthorized */}
          <SectionCard title="Unauthorized (Blocked) Apps" color="var(--error)">
            {apps.unauthorized.length > 0 && (
              <div className="apps-tag-list" style={{ marginBottom: '0.75rem' }}>
                {apps.unauthorized.map(app => (
                  <span key={app.id ?? app.name} className="app-pill app-pill-red">
                    {app.name}
                    <XBtn onClick={() => removeApp(childId, 'unauthorized', app.name)} label={app.name} />
                  </span>
                ))}
              </div>
            )}
            {apps.unauthorized.length === 0 && <p className="apps-empty">No blocked apps.</p>}
            <AddAppInput placeholder="Block an app (e.g. Discord)"
              onAdd={name => addApp(childId, 'unauthorized', name)} />
          </SectionCard>

          {/* Connected Devices */}
          <SectionCard title="Connected Devices" color="var(--accent-purple)">
            <p className="field-hint" style={{ marginBottom: '1rem' }}>
              Link devices your child uses so screen time parameters apply automatically.
              Verification is required to prevent unauthorized connections.
            </p>

            {devices.length === 0
              ? <p className="apps-empty">No devices connected.</p>
              : (
                <div className="device-list">
                  {devices.map(device => (
                    <div key={device.id} className="device-row">
                      <div className="device-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                          <line x1="12" y1="18" x2="12.01" y2="18"/>
                        </svg>
                      </div>
                      <span className="device-name">{device.name}</span>
                      <span className="device-verified-badge">✓ Verified</span>
                      <button className="x-btn x-btn-device"
                        onClick={() => removeDevice(childId, device.id)} title="Disconnect">✕</button>
                    </div>
                  ))}
                </div>
              )
            }

            {showVerify
              ? <DeviceVerifyFlow
                  onAdd={name => { addDevice(childId, name); setShowVerify(false) }}
                  onCancel={() => setShowVerify(false)}
                />
              : (
                <button className="add-app-btn" style={{ marginTop: '0.75rem' }}
                  onClick={() => setShowVerify(true)}>
                  + Connect Device
                </button>
              )
            }
          </SectionCard>
        </div>
      </main>
    </div>
  )
}
