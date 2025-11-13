import { useState, useCallback } from 'react'

/**
 * Hook para manejar autenticación OIDC
 * Conecta con el servidor de autenticación backend
 */
export function useOIDCAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Inicia el flujo de login con Google
   */
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const authServerUrl = import.meta.env.VITE_AUTH_SERVER || 'http://localhost:3000'
      const redirectUri = `${window.location.origin}/callback`

      // URL de redirección a Google OIDC
      const googleAuthUrl = new URL(`${authServerUrl}/oauth/authorize/google`)
      googleAuthUrl.searchParams.append('redirect_uri', redirectUri)
      googleAuthUrl.searchParams.append('response_type', 'code')

      window.location.href = googleAuthUrl.toString()
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión con Google')
      setIsLoading(false)
    }
  }, [])

  /**
   * Inicia el flujo de login con Microsoft
   */
  const loginWithMicrosoft = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const authServerUrl = import.meta.env.VITE_AUTH_SERVER || 'http://localhost:3000'
      const redirectUri = `${window.location.origin}/callback`

      // URL de redirección a Microsoft OIDC
      const microsoftAuthUrl = new URL(`${authServerUrl}/oauth/authorize/microsoft`)
      microsoftAuthUrl.searchParams.append('redirect_uri', redirectUri)
      microsoftAuthUrl.searchParams.append('response_type', 'code')

      window.location.href = microsoftAuthUrl.toString()
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión con Microsoft')
      setIsLoading(false)
    }
  }, [])

  /**
   * Maneja el callback después de la autenticación
   */
  const handleAuthCallback = useCallback(async (code, provider) => {
    setIsLoading(true)
    setError(null)

    try {
      const authServerUrl = import.meta.env.VITE_AUTH_SERVER || 'http://localhost:3000'

      const response = await fetch(`${authServerUrl}/oauth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          provider,
          redirectUri: window.location.origin,
        }),
      })

      if (!response.ok) {
        throw new Error('Error en la autenticación')
      }

      const data = await response.json()

      // Guardar token en localStorage
      localStorage.setItem('access_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)

      // Actualizar estado
      setUser(data.user)
      setIsAuthenticated(true)

      return data
    } catch (err) {
      setError(err.message || 'Error al procesar la autenticación')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Obtiene la información del usuario actual
   */
  const getCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        return null
      }

      const authServerUrl = import.meta.env.VITE_AUTH_SERVER || 'http://localhost:3000'

      const response = await fetch(`${authServerUrl}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        // Token expirado o inválido
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        return null
      }

      const userData = await response.json()
      setUser(userData)
      setIsAuthenticated(true)

      return userData
    } catch (err) {
      console.error('Error obteniendo perfil:', err)
      return null
    }
  }, [])

  /**
   * Cierra la sesión
   */
  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }, [])

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    loginWithGoogle,
    loginWithMicrosoft,
    handleAuthCallback,
    getCurrentUser,
    logout,
  }
}
