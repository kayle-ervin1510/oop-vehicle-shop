import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function BiometricsPage() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        <div className="back-row">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        </div>

        <div className="bio-page">
          <div className="bio-hero">
            <div className="bio-hero-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <div className="bio-hero-text">
              <h1>What is Biometrics?</h1>
              <p>
                Biometric authentication uses a person's unique physical characteristics —
                such as a fingerprint, face scan, or iris pattern — to verify their identity.
                On modern smartphones and tablets, this replaces or supplements the traditional password.
              </p>
            </div>
          </div>

          <div className="bio-section">
            <h2>How It Works</h2>
            <p>
              When you enroll a biometric on your device, the operating system captures and stores
              a mathematical representation of your unique feature (never a raw image). Each time
              you authenticate, the device compares a new scan to that stored template entirely
              on-device — your biometric data never leaves your phone.
            </p>
            <p>
              Common forms of biometrics supported on today's devices include:
            </p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Fingerprint</strong> — the ridges on your fingertip form a unique pattern read by a sensor.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Face ID / Face Unlock</strong> — an infrared camera maps the geometry of your face in 3D.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Iris scan</strong> — the pattern of your iris is as unique as a fingerprint and harder to spoof.</li>
            </ul>
          </div>

          <div className="bio-section">
            <h2>Why Biometrics Is More Secure</h2>
            <div className="bio-compare">
              <div className="bio-compare-card" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)' }}>
                <h3 style={{ color: 'var(--error)' }}>Password / Email Code</h3>
                <ul>
                  <li>Can be guessed, stolen, or phished</li>
                  <li>Children may watch you type it</li>
                  <li>Shared or reused passwords weaken security</li>
                  <li>Email codes can be intercepted if the inbox is accessible</li>
                </ul>
              </div>
              <div className="bio-compare-card" style={{ background: 'rgba(62,207,207,0.06)', borderColor: 'rgba(62,207,207,0.25)' }}>
                <h3 style={{ color: 'var(--accent-teal)' }}>Biometrics</h3>
                <ul>
                  <li>Unique to you — cannot be guessed</li>
                  <li>Always with you, nothing to forget</li>
                  <li>On-device only — never sent to servers</li>
                  <li>Extremely difficult to spoof without hardware</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bio-section">
            <h2>Setting Up Biometrics on Your Device</h2>
            <p>
              Biometric authentication is managed by your device's operating system, not by Zap App directly.
              To set it up, go to your device's <strong>Settings → Face ID &amp; Passcode</strong> (iOS) or
              {' '}<strong>Settings → Biometrics &amp; Security</strong> (Android) and follow the prompts to
              enroll your fingerprint or face.
            </p>
            <p>
              Once enabled on the device, Zap App can prompt for biometric confirmation before a child gains
              access to a restricted app — so even if they know your password, they cannot bypass the lock
              without your physical presence.
            </p>
          </div>

          <div className="bio-section">
            <h2>Privacy Assurance</h2>
            <p>
              Zap App never stores or transmits your biometric data. All biometric verification is handled
              entirely by the secure enclave on your device (Apple Secure Enclave or Android StrongBox).
              Zap App only receives a pass/fail signal from the OS — never the biometric template itself.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
