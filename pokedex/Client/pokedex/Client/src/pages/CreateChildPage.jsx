import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'

export default function CreateChildPage() {
  const navigate = useNavigate()
  const { addChild, error: contextError } = useApp()

  const [form, setForm] = useState({
    name: '',
    timeRestrictedApps: '',
    timeUnlimitedApps: '',
    unauthorizedApps: '',
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Child name is required.')
      return
    }
    const newId = await addChild(form)
    if (newId) {
      navigate('/dashboard')
    } else {
      setError(contextError || 'Failed to create profile. Please try again.')
    }
  }

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-main">
        <div className="page" style={{ minHeight: 'calc(100vh - 56px)', paddingTop: '2rem' }}>
          <div className="card">
            <p className="page-title">Create Child Profile</p>
            <p className="page-subtitle">
              Enter your child's name and the apps you'd like to manage. Use
              commas to separate multiple apps.
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Child Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Alex"
                  value={form.name}
                  onChange={handleChange}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="timeRestrictedApps">Time Restricted Apps</label>
                <input
                  id="timeRestrictedApps"
                  name="timeRestrictedApps"
                  type="text"
                  placeholder="e.g. Instagram, YouTube, TikTok"
                  value={form.timeRestrictedApps}
                  onChange={handleChange}
                />
                <p className="field-hint">Apps with a daily time limit. Separate with commas.</p>
              </div>

              <div className="form-group">
                <label htmlFor="timeUnlimitedApps">Time Unlimited Apps</label>
                <input
                  id="timeUnlimitedApps"
                  name="timeUnlimitedApps"
                  type="text"
                  placeholder="e.g. Google, Khan Academy"
                  value={form.timeUnlimitedApps}
                  onChange={handleChange}
                />
                <p className="field-hint">Apps with no time restriction.</p>
              </div>

              <div className="form-group">
                <label htmlFor="unauthorizedApps">Unauthorized Apps</label>
                <input
                  id="unauthorizedApps"
                  name="unauthorizedApps"
                  type="text"
                  placeholder="e.g. Discord, Snapchat"
                  value={form.unauthorizedApps}
                  onChange={handleChange}
                />
                <p className="field-hint">Apps that are fully blocked.</p>
              </div>

              <button type="submit" className="btn btn-primary">
                Create Profile
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/dashboard')}
              >
                ← Cancel
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
