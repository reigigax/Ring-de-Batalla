import { createContext, useContext, useState, useEffect, useCallback } from 'react'

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
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/usuario-actual', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            console.log("✅ Sesión recuperada:", data.user.nombre || data.user.email);
            setUser(data.user);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.log("ℹ️ Usuario no autenticado o servidor desconectado");
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  // Login con Google
  const login = useCallback((provider = 'google') => {
    setIsLoading(true);
    if (provider === 'google') {
      window.location.href = "http://localhost:3000/auth/google";
    } else {
      alert("Solo Google está configurado por el momento")
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch('http://localhost:3000/logout', {
        credentials: 'include'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    }
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
