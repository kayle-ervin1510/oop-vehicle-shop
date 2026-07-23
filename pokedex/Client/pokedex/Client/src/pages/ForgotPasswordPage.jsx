import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { findUserByEmail, resetPassword } = useApp()

  const [step, setStep] = useState('email')   // 'email' | 'code' | 'new-password' | 'done'
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [pwForm, setPwForm] = useState({ next: '', confirm: '' })
  const [pwError, setPwError] = useState('')

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setEmailError('')
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address.')
      return
    }
    const user = await findUserByEmail(email)
    if (!user) {
      setEmailError('No account found with that email address.')
      return
    }
    setStep('code')
  }

  function handleCodeSubmit(e) {
    e.preventDefault()
    setCodeError('')
    if (code.trim().length < 4) {
      setCodeError('Please enter the 4-digit code sent to your inbox.')
      return
    }
    setStep('new-password')
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPwError('')
    if (pwForm.next.length < 6) {
      setPwError('New password must be at least 6 characters.')
      return
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('Passwords do not match.')
      return
    }
    await resetPassword(email, pwForm.next)
    setStep('done')
    setTimeout(() => navigate('/login'), 2500)
  }

  return (
    <div className="page">
      <div className="card">
        <div className="step-indicator">
          <div className={`step-dot${step === 'email' ? ' active' : ' done'}`} />
          <div className={`step-dot${step === 'code' ? ' active' : step === 'new-password' || step === 'done' ? ' done' : ''}`} />
          <div className={`step-dot${step === 'new-password' ? ' active' : step === 'done' ? ' done' : ''}`} />
        </div>

        <div className="brand">ZAP APP</div>
        <div className="brand-sub">Password Reset</div>

        {/* Step 1 — Enter email */}
        {step === 'email' && (
          <>
            <p className="page-title">Forgot Your Password?</p>
            <p className="page-subtitle">
              Enter the email address linked to your account and we&rsquo;ll send you a reset code.
            </p>
            {emailError && <div className="alert alert-error">{emailError}</div>}
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-primary">Send Reset Code</button>
            </form>
          </>
        )}

        {/* Step 2 — Enter verification code */}
        {step === 'code' && (
          <>
            <p className="page-title">Check Your Inbox</p>
            <p className="page-subtitle">
              A verification code was sent to{' '}
              <span style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>{email}</span>.
              Enter it below to continue.
            </p>
            {codeError && <div className="alert alert-error">{codeError}</div>}
            <form onSubmit={handleCodeSubmit}>
              <div className="form-group">
                <label>Verification Code</label>
                <input
                  type="text"
                  className="code-input"
                  placeholder="• • • •"
                  maxLength={6}
                  value={code}
                  onChange={e => { setCode(e.target.value); setCodeError('') }}
                  autoFocus
                />
                <p className="field-hint" style={{ marginTop: '0.4rem' }}>
                  Hint: any 4+ character code works in this demo.
                </p>
              </div>
              <button type="submit" className="btn btn-primary">Verify Code</button>
            </form>
            <button className="btn btn-ghost" style={{ marginTop: '0.5rem' }} onClick={() => setStep('email')}>
              ← Use a different email
            </button>
          </>
        )}

        {/* Step 3 — Set new password */}
        {step === 'new-password' && (
          <>
            <p className="page-title">Set New Password</p>
            <p className="page-subtitle">Choose a strong password that only you know.</p>
            {pwError && <div className="alert alert-error">{pwError}</div>}
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={pwForm.next}
                  onChange={e => { setPwForm(f => ({ ...f, next: e.target.value })); setPwError('') }}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={pwForm.confirm}
                  onChange={e => { setPwForm(f => ({ ...f, confirm: e.target.value })); setPwError('') }}
                />
              </div>
              <button type="submit" className="btn btn-primary">Reset Password</button>
            </form>
          </>
        )}

        {/* Done */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✓</div>
            <p className="page-title" style={{ marginBottom: '0.5rem' }}>Password Reset!</p>
            <p className="page-subtitle">Your password has been updated. Redirecting you to login…</p>
          </div>
        )}

        {step !== 'done' && (
          <>
            <hr className="divider" />
            <div className="link-text">
              Remember your password?{' '}
              <button onClick={() => navigate('/login')}>Sign in</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
