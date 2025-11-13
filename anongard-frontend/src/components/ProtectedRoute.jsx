import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Componente que protege rutas que requieren autenticación
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e0e7ff',
            borderTopColor: '#667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}></div>
          <p>Cargando...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
