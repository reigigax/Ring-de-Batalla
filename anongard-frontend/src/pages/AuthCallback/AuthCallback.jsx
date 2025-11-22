import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useOIDCAuth } from '../../hooks/useOIDCAuth'
import './AuthCallback.css'

export function AuthCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { handleAuthCallback } = useOIDCAuth()
    const [status, setStatus] = useState('processing') // processing, success, error
    const [message, setMessage] = useState('Procesando autenticación...')

    useEffect(() => {
        const processCallback = async () => {
            const code = searchParams.get('code')
            const error = searchParams.get('error')

            // Determinar el proveedor basado en el estado o parámetro (simplificado aquí)
            // En una implementación real, el 'state' debería usarse para validar y saber el proveedor
            const provider = 'google' // Default o lógica para detectar

            if (error) {
                setStatus('error')
                setMessage('Error en la autenticación: ' + error)
                return
            }

            if (!code) {
                setStatus('error')
                setMessage('No se recibió código de autorización')
                return
            }

            try {
                await handleAuthCallback(code, provider)
                setStatus('success')
                setMessage('¡Autenticación exitosa! Redirigiendo...')

                // Redirigir después de un breve delay
                setTimeout(() => {
                    navigate('/home')
                }, 1500)
            } catch (err) {
                setStatus('error')
                setMessage('Error al procesar el login: ' + err.message)
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
                        <h2>Autenticando</h2>
                        <p>{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="callback-success-icon">✓</div>
                        <h2>¡Bienvenido!</h2>
                        <p>{message}</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="callback-error-icon">✕</div>
                        <h2>Error de Acceso</h2>
                        <p>{message}</p>
                        <button className="callback-button" onClick={() => navigate('/')}>
                            Volver al Login
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
