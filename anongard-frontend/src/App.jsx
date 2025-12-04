import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Login } from './pages/Login/Login'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Home } from './pages/Home/Home'
import { Profile } from './pages/Profile/Profile'
import { DebateHistory } from './pages/DebateHistory/DebateHistory'
import { DebateDetails } from './pages/DebateDetails/DebateDetails'
import { Ring } from './pages/Ring/Ring'
import { AuthCallback } from './pages/AuthCallback/AuthCallback'
import { CompleteRegistration } from './pages/CompleteRegistration/CompleteRegistration'
import { SocketProvider } from './context/SocketContext'
import { Contacts } from './pages/Contacts/Contacts'
import { Messages } from './pages/Messages/Messages'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Ruta pública - Login */}
            <Route path="/" element={<Login />} />

            {/* Ruta de callback para OAuth */}
            <Route path="/callback" element={<AuthCallback />} />

            {/* Ruta para completar registro */}
            <Route path="/complete-registration" element={<CompleteRegistration />} />

            {/* Rutas protegidas */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <DebateHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/debate/:debateId"
              element={
                <ProtectedRoute>
                  <DebateDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ring/:roomId"
              element={
                <ProtectedRoute>
                  <Ring />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
