import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import SignUpPage from './pages/SignUpPage'
import TermsPage from './pages/TermsPage'
import ConfirmPage from './pages/ConfirmPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CreateChildPage from './pages/CreateChildPage'
import ScreenTimePage from './pages/ScreenTimePage'
import ManageAppsPage from './pages/ManageAppsPage'
import EditParamsPage from './pages/EditParamsPage'
import ContactPage from './pages/ContactPage'
import ProfilePage from './pages/ProfilePage'
import BiometricsPage from './pages/BiometricsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DonatePage from './pages/DonatePage'
import buyMeAMilkImg from './assets/buy_me_a_milk.png'

// Redirect already-authenticated users away from auth pages
function PublicRoute({ children }) {
  const { currentUser } = useApp()
  return currentUser ? <Navigate to="/dashboard" replace /> : children
}

// Redirect unauthenticated users to login; hold render during session restoration
function ProtectedRoute({ children }) {
  const { currentUser, initializing } = useApp()
  if (initializing) return null
  return currentUser ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { currentUser } = useApp()
  return (
    <>
    {currentUser && (
      <Link
        to="/donate"
        title="Support Zap App"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: 'block',
          textDecoration: 'none',
        }}
      >
        <img
          src={buyMeAMilkImg}
          alt="Buy me a milk"
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            display: 'block',
          }}
        />
      </Link>
    )}
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth flow — redirect away if already logged in */}
      <Route path="/login"   element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup"  element={<PublicRoute><SignUpPage /></PublicRoute>} />
      <Route path="/terms"   element={<PublicRoute><TermsPage /></PublicRoute>} />
      <Route path="/confirm"          element={<PublicRoute><ConfirmPage /></PublicRoute>} />
      <Route path="/forgot-password"  element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* Protected app pages */}
      <Route path="/dashboard"                          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/new-child"                element={<ProtectedRoute><CreateChildPage /></ProtectedRoute>} />
      <Route path="/dashboard/:childId/overview"        element={<ProtectedRoute><ScreenTimePage /></ProtectedRoute>} />
      <Route path="/dashboard/:childId/apps"            element={<ProtectedRoute><ManageAppsPage /></ProtectedRoute>} />
      <Route path="/dashboard/:childId/edit/:appName"   element={<ProtectedRoute><EditParamsPage /></ProtectedRoute>} />
      <Route path="/contact"                            element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
      <Route path="/profile"                            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/biometrics"                         element={<ProtectedRoute><BiometricsPage /></ProtectedRoute>} />
      <Route path="/donate"                             element={<ProtectedRoute><DonatePage /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
