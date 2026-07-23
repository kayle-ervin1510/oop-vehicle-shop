import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function TermsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { registerUser } = useApp()
  const form = location.state?.form
  const [agreed, setAgreed] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')

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

  return (
    <div className="page">
      <div className="card card-wide">
        <div className="step-indicator">
          <div className="step-dot done" />
          <div className="step-dot active" />
          <div className="step-dot" />
          <div className="step-dot" />
        </div>

        <div className="brand">ZAP APP</div>
        <div className="brand-sub">Terms &amp; Conditions</div>

        <div className="terms-body">
          <p>
            We are dedicated to helping parents monitor and regulate their child&rsquo;s screen time.
            In this age of ever-growing technology, we believe it is vitally important that children
            take time out of their day to enjoy the real world, not just the virtual one.
          </p>

          <p>
            With the <strong>Zap App</strong>, parents can pick and choose what apps their children have
            access to, as well as select how easy they want their child to access an app. They can choose
            to have a two-step verification for a child to access an app, or simply allow access without
            verification.
          </p>

          <p>
            Parents can also set limits to how long a child is on a specific application. Don&rsquo;t
            worry — these parameters are not set in stone! If a parent decides to shorten or lengthen
            their child&rsquo;s screen time for a specific app, they can do so in the child&rsquo;s
            Profile Page, underneath the tab: <strong>&ldquo;Edit&rdquo;</strong>.
          </p>

          <p>
            Please note that the Zap App collects data on how long users spend on their devices and their
            apps. We do not use this data for anything, other than allowing parents to see how long and how
            often the child is on their device, and which apps they frequent most.
          </p>

          <p>
            <strong>None of the data we collect is shared with any companies</strong>, and it is deleted
            when the parents delete an account. Because of the way Zap App works, the collected data cannot
            be deleted or edited by any of the users.
          </p>

          <p>
            <strong>Note —</strong> For the best experience at Zap App, it is suggested that children do
            not know their parent&rsquo;s password for Zap App, or have access to their parent&rsquo;s
            email. It is also suggested that Biometrics be set up for those parents who have accomplished
            password guessers.
          </p>
        </div>

        <label className="checkbox-group" onClick={() => setAgreed(a => !a)}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(a => !a)}
            onClick={e => e.stopPropagation()}
          />
          <span>I agree to the Terms and Conditions</span>
        </label>

        {regError && <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>{regError}</div>}

        <button
          className="btn btn-primary"
          onClick={async () => {
            setRegError('')
            setRegLoading(true)
            const result = await registerUser(form)
            setRegLoading(false)
            if (result.error) {
              const msg = result.error
              if (msg.includes('already registered') || msg.includes('already been registered')) {
                setRegError('An account with that email already exists. Try logging in.')
              } else if (msg.includes('username')) {
                setRegError('That username is already taken.')
              } else {
                setRegError(msg)
              }
              return
            }
            // If Supabase auto-confirmed the account (email confirmation disabled),
            // skip the OTP screen and go straight to login.
            const alreadyConfirmed = !!result.user?.email_confirmed_at
            if (alreadyConfirmed) {
              navigate('/login', { state: { signupSuccess: true } })
            } else {
              navigate('/confirm', { state: { form } })
            }
          }}
          disabled={!agreed || regLoading}
          style={{ opacity: (agreed && !regLoading) ? 1 : 0.45, cursor: (agreed && !regLoading) ? 'pointer' : 'not-allowed', marginTop: '1rem' }}
        >
          {regLoading ? 'Creating account…' : 'Continue →'}
        </button>

        <button className="btn btn-ghost" onClick={() => navigate('/signup')}>
          ← Back
        </button>
      </div>
    </div>
  )
}
