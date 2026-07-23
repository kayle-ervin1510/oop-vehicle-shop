import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignUpPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    preferredName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    confirmEmail: '',
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.firstName || !form.username || !form.password || !form.email) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.email !== form.confirmEmail) {
      setError('Email addresses do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    navigate('/terms', { state: { form } })
  }

  return (
    <div className="page">
      <div className="card">
        <div className="step-indicator">
          <div className="step-dot active" />
          <div className="step-dot" />
          <div className="step-dot" />
          <div className="step-dot" />
        </div>

        <div className="brand">ZAP APP</div>
        <div className="brand-sub">Screen Time Management</div>

        <p className="page-title">Create Your Account</p>
        <p className="page-subtitle">
          Please enter the following fields to get started.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Jane"
              value={form.firstName}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredName">Preferred Name</label>
            <input
              id="preferredName"
              name="preferredName"
              type="text"
              placeholder="Jane (optional)"
              value={form.preferredName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="jane_parent"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmEmail">Confirm Email *</label>
            <input
              id="confirmEmail"
              name="confirmEmail"
              type="email"
              placeholder="Re-enter your email"
              value={form.confirmEmail}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Continue →
          </button>
        </form>

        <div className="link-text">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')}>Log in</button>
        </div>
      </div>
    </div>
  )
}
