import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useOIDCAuth } from '../hooks/useOIDCAuth'
import '../styles/AuthCallback.css'

export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { handleAuthCallback, isLoading, error } = useOIDCAuth()
  const [status, setStatus] = useState('processing')

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code')
        const provider = searchParams.get('provider') || 'google'
        const errorParam = searchParams.get('error')

        if (errorParam) {
          setStatus('error')
          console.error('Error from auth provider:', errorParam)
          return
        }

        if (!code) {
          setStatus('error')
          console.error('No authorization code received')
          return
        }

        setStatus('processing')
        await handleAuthCallback(code, provider)
        setStatus('success')

        // Redirigir al home después de 2 segundos
        setTimeout(() => {
          navigate('/home')
        }, 2000)
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
      }
    }

    processCallback()
  }, [searchParams, handleAuthCallback, navigate])

  return (
    <div className="auth-callback-container">
      <div className="callback-card">
        {status === 'processing' && (
          <>
            <div className="callback-spinner"></div>
            <h2>Autenticando...</h2>
            <p>Por favor espera mientras completamos tu autenticación.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="callback-success-icon">✓</div>
            <h2>¡Autenticación exitosa!</h2>
            <p>Redirigiendo al dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="callback-error-icon">✕</div>
            <h2>Error en la autenticación</h2>
            <p>{error || 'Hubo un problema al procesar tu autenticación.'}</p>
            <button
              className="callback-button"
              onClick={() => window.location.href = '/'}
            >
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
