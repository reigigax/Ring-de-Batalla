import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

/**
 * Componente que protege rutas que requieren autenticación
 */
export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading, user } = useAuth()

    if (isLoading) {
        return (
            <LoadingSpinner size="large" text="Verificando sesión..." />
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    // Verificar si el usuario completó el registro
    if (user && user.registro_completo === 0) {
        return <Navigate to="/complete-registration" replace />
    }

    return children
}
