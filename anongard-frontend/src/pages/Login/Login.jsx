import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import anongardLogo from '../../assets/anongard-logo.png'
import './Login.css'

export function Login() {
    const navigate = useNavigate()
    const { login, isAuthenticated, isLoading, error } = useAuth()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home')
        }
    }, [isAuthenticated, navigate]);

    if (isLoading && !isAuthenticated) {
        return <LoadingSpinner overlay text="Cargando..." />
    }

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Logo y Título */}
                <div className="login-header">
                    <div className="login-logo">
                        <img
                            src={anongardLogo}
                            alt="AnonGard Logo"
                            className="shield-icon"
                            style={{ width: '80px', height: 'auto' }}
                        />
                    </div>
                    <h1 className="login-title">Ring de Batalla</h1>
                    <p className="login-subtitle">AnonGard - Espacio Seguro para Debatir</p>
                </div>

                {/* Descripción */}
                <div className="login-description">
                    <p>
                        Acceso exclusivo para la comunidad educativa mediante credenciales institucionales.
                    </p>
                </div>

                {/* Botones de autenticación */}
                <div className="login-buttons">
                    <Button
                        variant="google"
                        onClick={() => login('google')}
                        disabled={isLoading}
                        className="auth-button"
                        icon={
                            <svg
                                className="auth-icon"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        }
                    >
                        Continuar con Google
                    </Button>

                    <Button
                        variant="microsoft"
                        onClick={() => login('google')}
                        disabled={isLoading}
                        className="auth-button"
                        icon={
                            <svg
                                className="auth-icon"
                                viewBox="0 0 23 23"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                                <rect x="13" y="1" width="9" height="9" fill="#7FBA00" />
                                <rect x="1" y="13" width="9" height="9" fill="#00A4EF" />
                                <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
                            </svg>
                        }
                    >
                        Continuar con Microsoft
                    </Button>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="error-indicator">
                        <p>{error}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="login-footer">
                    <p className="privacy-notice">
                        ✓ Sin contraseñas locales<br />
                        ✓ Datos protegidos<br />
                        ✓ Cumplimiento normativo
                    </p>
                </div>
            </div>

            {/* Branding secundario */}
            <div className="login-background">
                <div className="background-shape shape-1"></div>
                <div className="background-shape shape-2"></div>
                <div className="background-shape shape-3"></div>
            </div>

            {/* Loading Spinner Overlay */}
            {isLoading && <LoadingSpinner overlay text="Iniciando sesión..." />}
        </div>
    )
}