import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import './Profile.css'

export function Profile() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    // Usar los campos de la base de datos
    const userName = user?.nombre || 'Usuario';
    const userEmail = user?.email || 'email@ejemplo.com';
    const userAvatar = user?.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3A7CA5&color=fff`;
    const userRole = user?.rol || 'Estudiante';

    // Formatear fecha de creación
    const memberSince = user?.creado_en ? new Date(user.creado_en).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : 'Nov 2025';

    return (
        <div className="profile-container">
            {/* Header */}
            <header className="profile-header">
                <div className="profile-header-content">
                    <Button className="back-button" onClick={() => navigate('/home')} icon={
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                    }>
                        Volver
                    </Button>
                    <h1>Mi Perfil</h1>
                    <Button variant="danger" className="logout-btn" onClick={handleLogout}>
                        Salir
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="profile-main">
                <div className="profile-content">
                    {/* Profile Card */}
                    <section className="profile-section">
                        <div className="profile-card-main">
                            <div className="profile-card-header">
                                <img src={userAvatar} alt="Perfil" className="profile-avatar-large" />
                                <div className="profile-card-info">
                                    <h2>{userName}</h2>
                                    <p className="profile-email">{userEmail}</p>
                                    <span className={`profile-role ${userRole?.toLowerCase()}`}>
                                        {userRole === 'Profesor' ? '👨‍🏫 Profesor/a' :
                                            userRole === 'Alumno' ? '🎓 Estudiante' :
                                                userRole === 'Funcionario' ? '👔 Funcionario' : '🎓 Estudiante'}
                                    </span>
                                </div>
                            </div>

                            <div className="profile-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Miembro Desde</span>
                                    <span className="meta-value">{memberSince}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Estado</span>
                                    <span className="meta-value status-active">● Activo</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Statistics */}
                    <section className="stats-section">
                        <h3>Estadísticas</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon debates-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                                    </svg>
                                </div>
                                <span className="stat-label">Debates Participados</span>
                                <span className="stat-value">4</span>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon created-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                </div>
                                <span className="stat-label">Debates Creados</span>
                                <span className="stat-value">2</span>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon time-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </svg>
                                </div>
                                <span className="stat-label">Tiempo Total</span>
                                <span className="stat-value">190 min</span>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon participants-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                </div>
                                <span className="stat-label">Participantes Totales</span>
                                <span className="stat-value">29</span>
                            </div>
                        </div>
                    </section>

                    {/* Badges Section */}
                    <section className="badges-section">
                        <h3>Logros Desbloqueados</h3>
                        <div className="badges-grid">
                            <div className="badge">
                                <div className="badge-icon">🏆</div>
                                <span className="badge-name">Debatidor Activo</span>
                                <span className="badge-desc">Participó en 4+ debates</span>
                            </div>

                            <div className="badge">
                                <div className="badge-icon">⭐</div>
                                <span className="badge-name">Buen Orador</span>
                                <span className="badge-desc">Calificación promedio alta</span>
                            </div>

                            <div className="badge">
                                <div className="badge-icon">🎯</div>
                                <span className="badge-name">Argumentación Sólida</span>
                                <span className="badge-desc">Resúmenes con IA de calidad</span>
                            </div>

                            <div className="badge">
                                <div className="badge-icon">🚀</div>
                                <span className="badge-name">Early Adopter</span>
                                <span className="badge-desc">De los primeros en usar AnonGard</span>
                            </div>
                        </div>
                    </section>

                    {/* Recent Debates */}
                    <section className="recent-debates-section">
                        <h3>Debates Recientes</h3>
                        <div className="debates-list">
                            <div className="debate-item">
                                <div className="debate-type-badge general">General</div>
                                <div className="debate-details">
                                    <h4>Debate sobre Evaluaciones</h4>
                                    <span className="debate-date">📅 12 Nov 2025</span>
                                </div>
                                <div className="debate-duration">⏱️ 45 min</div>
                            </div>

                            <div className="debate-item">
                                <div className="debate-type-badge private">Privada</div>
                                <div className="debate-details">
                                    <h4>Mediación de Conflicto</h4>
                                    <span className="debate-date">📅 10 Nov 2025</span>
                                </div>
                                <div className="debate-duration">⏱️ 30 min</div>
                            </div>

                            <div className="debate-item">
                                <div className="debate-type-badge general">General</div>
                                <div className="debate-details">
                                    <h4>Planificación Académica</h4>
                                    <span className="debate-date">📅 8 Nov 2025</span>
                                </div>
                                <div className="debate-duration">⏱️ 60 min</div>
                            </div>

                            <div className="debate-item">
                                <div className="debate-type-badge general">General</div>
                                <div className="debate-details">
                                    <h4>Innovación en Educación</h4>
                                    <span className="debate-date">📅 5 Nov 2025</span>
                                </div>
                                <div className="debate-duration">⏱️ 55 min</div>
                            </div>
                        </div>
                    </section>

                    {/* Settings Section */}
                    <section className="settings-section">
                        <h3>Preferencias</h3>
                        <div className="settings-list">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>📧 Notificaciones por Email</h4>
                                    <p>Recibe alertas de nuevos debates y actualizaciones importantes</p>
                                </div>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>👤 Perfil Público</h4>
                                    <p>Permite que otros usuarios vean tu perfil y estadísticas</p>
                                </div>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>🤖 Resúmenes con IA</h4>
                                    <p>Generar resúmenes automáticos al finalizar debates</p>
                                </div>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
