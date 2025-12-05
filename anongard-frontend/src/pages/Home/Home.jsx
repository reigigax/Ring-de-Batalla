import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import './Home.css'
import anongardLogo from '../../assets/anongard-logo.png'
import { useSocket } from '../../context/SocketContext'
import { useState, useEffect } from 'react'


export function Home() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const socket = useSocket()
    const [unreadInvitations, setUnreadInvitations] = useState(0)

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/invitaciones/pendientes', { credentials: 'include' });
                const data = await response.json();
                setUnreadInvitations(data.length);
            } catch (error) {
                console.error('Error fetching invitations:', error);
            }
        };
        fetchUnreadCount();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('invitation_received', () => {
                setUnreadInvitations(prev => prev + 1);
            });

            return () => {
                socket.off('invitation_received');
            };
        }
    }, [socket]);

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleMessagesClick = () => {
        setUnreadInvitations(0);
        navigate('/messages');
    }

    const userName = user?.nombre || 'Usuario';
    const userAvatar = user?.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3A7CA5&color=fff`;
    const userRole = user?.rol || 'Estudiante';

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="home-header-content">
                    <div className="app-logo">
                        <img
                            src={anongardLogo}
                            alt="AnonGard Logo"
                            className="logo-icon"
                            style={{ width: '40px', height: 'auto' }}
                        />
                        <h1>Ring de Batalla</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {/* Messages/Notifications Button */}
                        <div style={{ position: 'relative' }}>
                            <Button
                                variant="secondary"
                                onClick={handleMessagesClick}
                                style={{ position: 'relative' }}
                            >
                                <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor', marginRight: '6px' }}>
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                                Mensajes
                            </Button>
                            {unreadInvitations > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: '#ff4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '22px',
                                    height: '22px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    border: '2px solid white',
                                    animation: 'pulse 2s infinite',
                                    zIndex: 10
                                }}>
                                    {unreadInvitations > 9 ? '9+' : unreadInvitations}
                                </span>
                            )}
                        </div>
                        <Button
                            variant="danger"
                            className="logout-btn-header"
                            onClick={handleLogout}
                        >
                            Salir
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="home-main">
                <div className="home-content">
                    {/* Welcome Card */}
                    <div className="welcome-card">
                        <div className="welcome-header">
                            <img src={userAvatar}
                                alt="Perfil" className="welcome-avatar" />
                            <div className="welcome-info">
                                <h2>👋 ¡Bienvenido/a, {userName}!</h2>
                                <p className="welcome-subtitle">
                                    {userRole === 'Profesor' ? '👨‍🏫 Profesor/a' :
                                        userRole === 'Alumno' ? '🎓 Estudiante' :
                                            userRole === 'Funcionario' ? '👔 Funcionario' : '🎓 Estudiante'} de AnonGard
                                </p>
                            </div>
                        </div>
                        <p className="welcome-description">
                            Bienvenido a Ring de Batalla, la plataforma segura de debates educativos. Accede a tu perfil o comienza a participar en debates.
                        </p>
                    </div>

                    {/* Main Options Grid */}
                    <section className="options-section">
                        <div className="options-grid">
                            {/* Profile Card */}
                            <div className="option-card profile-card" onClick={() => navigate('/profile')}>
                                <div className="option-card-inner">

                                    <div className="option-content">
                                        <h3>👤 Mi Perfil</h3>
                                        <p>Ver y editar tu información personal y estadísticas</p>
                                    </div>
                                    <div className="option-arrow">
                                        <svg viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M8.59 16.59L10 18l8-8-8-8-1.41 1.41L14.17 9H6v2h8.17l-5.58 5.59z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Ring de Batalla Card */}
                            <div className="option-card ring-card" onClick={() => navigate('/dashboard')}>
                                <div className="option-card-inner">
                                    <div className="option-icon ring-icon">
                                        <svg viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="option-content">
                                        <h3>🏛️ Ring de Batalla</h3>
                                        <p>Accede a debates en vivo y crea nuevas salas</p>
                                    </div>
                                    <div className="option-arrow">
                                        <svg viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M8.59 16.59L10 18l8-8-8-8-1.41 1.41L14.17 9H6v2h8.17l-5.58 5.59z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Info Cards */}
                    <section className="info-section">
                        <h3>¿Qué es Ring de Batalla?</h3>
                        <div className="info-cards">
                            <div className="info-card">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
                                        />
                                    </svg>
                                </div>
                                <h4>Seguro y Privado</h4>
                                <p>Tu información está protegida con encriptación y autenticación segura</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                                        />
                                    </svg>
                                </div>
                                <h4>Debates en Vivo</h4>
                                <p>Participa en debates educativos estructurados y moderados</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                        />
                                    </svg>
                                </div>
                                <h4>Sin Grabaciones</h4>
                                <p>Los debates no se graban, solo se generan resúmenes con IA</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                                        />
                                    </svg>
                                </div>
                                <h4>Soporte IA</h4>
                                <p>Resúmenes automáticos y análisis de debates con IA</p>
                            </div>
                        </div>
                    </section>

                    {/* Quick Stats */}
                    <section className="quick-stats">
                        <div className="stat-item">
                            <span className="stat-number">4</span>
                            <span className="stat-label">Debates Participados</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">29</span>
                            <span className="stat-label">Compañeros</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">190</span>
                            <span className="stat-label">Minutos de Debate</span>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
