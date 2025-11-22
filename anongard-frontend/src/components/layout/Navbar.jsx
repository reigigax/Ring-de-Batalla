import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'
import anongardLogo from '../../assets/anongard-logo.png'

export function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const isDashboard = location.pathname === '/dashboard'

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <header className="navbar">
            <div className="navbar-content">
                {/* Left Section */}
                <div className="navbar-left">
                    {isDashboard ? (
                        <button
                            className="nav-button home-button"
                            onClick={() => navigate('/home')}
                            title="Volver al inicio"
                        >
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                            <span className="desktop-only">Inicio</span>
                        </button>
                    ) : (
                        <div className="app-logo" onClick={() => navigate('/home')}>
                            <img
                                src={anongardLogo}
                                alt="AnonGard Logo"
                                className="logo-icon"
                            />
                            <h1>Ring de Batalla</h1>
                        </div>
                    )}
                </div>

                {/* Center Section (Dashboard only) */}
                {isDashboard && (
                    <div className="navbar-center">
                        <div className="app-title">
                            <img
                                src={anongardLogo}
                                alt="AnonGard Logo"
                                className="shield-icon"
                            />
                            <h1>Ring de Batalla</h1>
                        </div>
                    </div>
                )}

                {/* Right Section */}
                <div className="navbar-right">
                    {user && (
                        <div className="user-menu">
                            {isDashboard && (
                                <>
                                    <div className="user-info desktop-only">
                                        <img src={user.avatar} alt={user.name} className="user-avatar" />
                                        <div className="user-details">
                                            <p className="user-name">{user.name}</p>
                                            <p className="user-role">
                                                {user.role === 'teacher' ? 'Profesor/a' : 'Estudiante'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="nav-button history-button"
                                        onClick={() => navigate('/history')}
                                        title="Ver historial"
                                    >
                                        <svg viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.63-2.04c-.39-.49-1.01-.49-1.4 0-.39.49-.39 1.28 0 1.77l2.34 2.92c.39.49 1.01.49 1.4 0l3.46-4.46c.39-.49.39-1.28 0-1.77-.39-.49-1.01-.49-1.4 0z"
                                            />
                                        </svg>
                                    </button>
                                </>
                            )}

                            <button className="logout-button" onClick={handleLogout}>
                                <span className="desktop-only">Cerrar sesión</span>
                                <span className="mobile-only">Salir</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
