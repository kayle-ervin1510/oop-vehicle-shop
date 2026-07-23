import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="brand" style={{ textDecoration: 'none' }}>
        ZAP APP
      </Link>

      <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {currentUser && (
          <li>
            <Link
              to="/profile"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.target.style.color = 'var(--accent-orange)')}
              onMouseLeave={e => (e.target.style.color = 'var(--text-secondary)')}
            >
              {currentUser.preferred_name || currentUser.first_name}
            </Link>
          </li>
        )}
        <li>
          <button
            onClick={handleLogout}
            style={{
              background: 'var(--accent-orange)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem 0.9rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  )
}
