import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  loginWithGoogle,
  loginWithMicrosoft,
  logout as authServiceLogout,
  getCurrentUser,
  isAuthenticated as checkAuthenticated,
  saveSession,
} from '../services/authService'

// Crear contexto
const AuthContext = createContext(null)

/**
 * Provider de autenticación
 * Envuelve la app para proporcionar estado de auth a todos los componentes
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar si hay sesión al montar
  useEffect(() => {
    const checkSession = () => {
      try {
        if (checkAuthenticated()) {
          const currentUser = getCurrentUser()
          if (currentUser) {
            const userFromStorage = localStorage.getItem('user')
            setUser(JSON.parse(userFromStorage))
            setIsAuthenticated(true)
          }
        }
      } catch (err) {
        console.error('Error verificando sesión:', err)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  // Login con Google
  const login = useCallback(async (provider = 'google') => {
    setIsLoading(true)
    setError(null)

    try {
      let authData
      if (provider === 'google') {
        authData = await loginWithGoogle()
      } else if (provider === 'microsoft') {
        authData = await loginWithMicrosoft()
      } else {
        throw new Error('Provider no soportado')
      }

      // Guardar sesión
      saveSession(authData)

      // Actualizar estado
      setUser(authData.user)
      setIsAuthenticated(true)

      return authData
    } catch (err) {
      const errorMessage = err.message || 'Error en la autenticación'
      setError(errorMessage)
      console.error('Error en login:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    authServiceLogout()
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook para acceder al contexto de autenticación
 * @throws {Error} Si se usa fuera del AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
