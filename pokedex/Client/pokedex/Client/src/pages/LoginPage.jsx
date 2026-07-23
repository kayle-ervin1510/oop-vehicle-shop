import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, currentUser } = useApp()

  const [form, setForm] = useState({ usernameOrEmail: '', password: '' })
  const [error, setError] = useState('')
  const signupSuccess = location.state?.signupSuccess

  if (currentUser) {
    navigate('/dashboard', { replace: true })
    return null
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.usernameOrEmail || !form.password) {
      setError('Please enter your username/email and password.')
      return
    }
    const result = await login(form.usernameOrEmail, form.password)
    if (result.ok) {
      navigate('/dashboard')
    } else {
      const msg = result.error || ''
      if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Your email address has not been confirmed yet. Please check your inbox for the confirmation code.')
      } else {
        setError('Invalid credentials. Check your username/email and password.')
      }
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="step-indicator">
          <div className="step-dot done" />
          <div className="step-dot done" />
          <div className="step-dot done" />
          <div className="step-dot active" />
        </div>

        <div className="brand">ZAP APP</div>
        <div className="brand-sub">Screen Time Management</div>

        <p className="page-title">Welcome Back</p>
        <p className="page-subtitle">Sign in to manage your children&rsquo;s screen time.</p>

        {signupSuccess && <div className="alert alert-success">Account created! Sign in below.</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              id="usernameOrEmail"
              name="usernameOrEmail"
              type="text"
              placeholder="jane_parent or jane@example.com"
              value={form.usernameOrEmail}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Confirm Login
          </button>
        </form>

        <div style={{ textAlign: 'right', marginTop: '0.6rem' }}>
          <Link
            to="/forgot-password"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => (e.target.style.color = 'var(--accent-orange)')}
            onMouseLeave={e => (e.target.style.color = 'var(--text-muted)')}
          >
            Forgot password?
          </Link>
        </div>

        <hr className="divider" />

        <div className="link-text">
          Don&rsquo;t have an account?{' '}
          <button onClick={() => navigate('/signup')}>Sign up</button>
        </div>
      </div>
    </div>
  )
}
