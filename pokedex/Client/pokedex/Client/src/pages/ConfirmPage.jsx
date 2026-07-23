import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ConfirmPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmail } = useApp()
  const form = location.state?.form
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!form) {
    return (
      <div className="page">
        <div className="card text-center">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            No registration in progress.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/signup')}>
            Go to Sign Up
          </button>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (code.trim().length < 4) {
      setError('Please enter a valid confirmation code (at least 4 characters).')
      return
    }
    setLoading(true)
    setError('')
    const result = await verifyEmail(form.email, code.trim())
    setLoading(false)
    if (result.error) {
      setError('Invalid or expired code. Please check your email and try again.')
      return
    }
    navigate('/login')
  }

  return (
    <div className="page">
      <div className="card">
        <div className="step-indicator">
          <div className="step-dot done" />
          <div className="step-dot done" />
          <div className="step-dot active" />
          <div className="step-dot" />
        </div>

        <div className="brand">ZAP APP</div>
        <div className="brand-sub">Verify Your Account</div>

        <p className="page-title">Almost Done!</p>
        <p className="page-subtitle">
          To verify your account, please check the inbox of{' '}
          <span className="text-orange">{form.email}</span> and type the
          code below.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Email Confirmation Code</label>
            <input
              id="code"
              type="text"
              className="code-input"
              placeholder="••••••"
              value={code}
              onChange={e => {
                setCode(e.target.value)
                setError('')
              }}
              maxLength={8}
              autoFocus
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Confirm Account →'}
          </button>
        </form>

        <div className="link-text" style={{ marginTop: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Check your email inbox for a 6-digit confirmation code from Supabase.
          </span>
        </div>
      </div>
    </div>
  )
}
