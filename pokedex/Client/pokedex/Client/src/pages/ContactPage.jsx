import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function ContactPage() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        <div className="back-row">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
        </div>

        <div className="contact-wrapper">
          <div className="contact-card">
            <div className="contact-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="var(--accent-orange)" strokeWidth="2" fill="none" />
                <path d="M14 18h20v14a2 2 0 01-2 2H16a2 2 0 01-2-2V18z" stroke="var(--accent-orange)" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
                <path d="M14 18l10 9 10-9" stroke="var(--accent-orange)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1 className="contact-title">Contact Us!</h1>
            <p className="contact-intro">
              If you are experiencing trouble, or have any suggestions, please
              let us know!
            </p>

            <div className="contact-details">
              <div className="contact-row">
                <span className="contact-label">Email Address:</span>
                <a
                  href="mailto:contact@hotmail.com"
                  className="contact-link"
                >
                  contact@hotmail.com
                </a>
              </div>
              <div className="contact-row">
                <span className="contact-label">Phone:</span>
                <a href="tel:5558888888" className="contact-link contact-link-plain">
                  555-888-8888
                </a>
              </div>
            </div>

            <hr className="divider" />

            <div className="contact-rate">
              <p className="contact-rate-label">Enjoying Zap App?</p>
              <button className="btn btn-rate">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Rate the Zap App on Google Play
              </button>
            </div>
          </div>

          <div className="contact-side">
            <div className="faq-card">
              <h2 className="faq-title">Quick Help</h2>
              <ul className="faq-list">
                <li className="faq-item">
                  <span className="faq-q">How do I change my child's screen time limit?</span>
                  <p className="faq-a">
                    Screen time limits are permanent until you change them. You
                    can adjust per-app limits at any time from Manage Apps on
                    your child&rsquo;s profile.
                  </p>
                </li>
                <li className="faq-item">
                  <span className="faq-q">Can my child bypass the restrictions?</span>
                  <p className="faq-a">
                    For maximum security, enable Parental Password and Email
                    Verification on sensitive apps, and consider setting up{' '}
                    <Link to="/biometrics">biometrics</Link>.
                  </p>
                </li>
                <li className="faq-item">
                  <span className="faq-q">Is my data shared with third parties?</span>
                  <p className="faq-a">
                    No. Zap App never shares your data with any company. All
                    collected screen time data is deleted when you close your
                    account.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
