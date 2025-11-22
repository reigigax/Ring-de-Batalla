import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import './DebateHistory.css'


export function DebateHistory() {
    const navigate = useNavigate()
    const { user } = useAuth()

    return (
        <div className="history-container">
            {/* Header */}
            <header className="history-header">
                <Button
                    className="back-button"
                    onClick={() => navigate('/dashboard')}
                    icon={
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                    }
                >
                    Volver
                </Button>
                <h1>Historial de Debates</h1>
                <p className="user-info">
                    Viendo historial de: <strong>{user?.name}</strong>
                </p>
            </header>

            {/* Main Content */}
            <main className="history-content">
                {/* Stats Summary */}
                <section className="history-stats">
                    <div className="stat-card">
                        <div className="stat-icon debates-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">Debates Totales</span>
                            <span className="stat-value">12</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon participants-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">Interacciones</span>
                            <span className="stat-value">145</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon duration-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">Horas Totales</span>
                            <span className="stat-value">8.5</span>
                        </div>
                    </div>
                </section>

                {/* Debates List */}
                <section className="debates-section">
                    <h2>Debates Recientes</h2>
                    <div className="debates-list">
                        {/* Debate Item 1 */}
                        <div className="debate-card">
                            <div className="debate-header">
                                <div className="debate-title-section">
                                    <h3>Ética en la Inteligencia Artificial</h3>
                                    <span className="debate-type general">General</span>
                                </div>
                                <span className="debate-date">15 Nov 2025</span>
                            </div>
                            <p className="debate-summary">
                                Discusión sobre los límites éticos en el desarrollo de IA y su impacto en la sociedad futura.
                            </p>
                            <div className="debate-meta">
                                <div className="meta-item">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                    <span>8 Participantes</span>
                                </div>
                                <div className="meta-item">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </svg>
                                    <span>45 min</span>
                                </div>
                            </div>
                            <div className="debate-actions">
                                <button className="action-btn view-report">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                    </svg>
                                    Ver Resumen IA
                                </button>
                                <button className="action-btn view-details">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                    </svg>
                                    Ver Detalles
                                </button>
                            </div>
                        </div>

                        {/* Debate Item 2 */}
                        <div className="debate-card">
                            <div className="debate-header">
                                <div className="debate-title-section">
                                    <h3>Resolución de Conflictos Escolares</h3>
                                    <span className="debate-type private">Privada</span>
                                </div>
                                <span className="debate-date">10 Nov 2025</span>
                            </div>
                            <p className="debate-summary">
                                Sesión de mediación y estrategias para mejorar la convivencia escolar.
                            </p>
                            <div className="debate-meta">
                                <div className="meta-item">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                    <span>4 Participantes</span>
                                </div>
                                <div className="meta-item">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </svg>
                                    <span>30 min</span>
                                </div>
                            </div>
                            <div className="debate-actions">
                                <button className="action-btn view-report">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                    </svg>
                                    Ver Resumen IA
                                </button>
                                <button className="action-btn view-details">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                    </svg>
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
