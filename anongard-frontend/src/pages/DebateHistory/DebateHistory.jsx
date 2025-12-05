import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { roomService } from '../../services/roomService'
import './DebateHistory.css'
import anongardLogo from '../../assets/anongard-logo.png'


export function DebateHistory() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const userName = user?.displayName || user?.name?.givenName || user?.nombre || 'Usuario';

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await roomService.getHistory();
                setHistory(data);
            } catch (err) {
                console.error('Error fetching history:', err);
                setError('No se pudo cargar el historial.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const totalDebates = history.length;
    const totalDuration = history.reduce((acc, curr) => acc + (curr.duracion_real || 0), 0);
    const totalHours = (totalDuration / 3600).toFixed(1);
    const totalInteractions = history.reduce((acc, curr) => acc + (curr.total_participantes || 0), 0);

    if (loading) return <div className="history-loading">Cargando historial...</div>;

    return (
        <div className="history-container">
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
                    Viendo historial de: <strong>{userName}</strong>
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
                            <span className="stat-value">{totalDebates}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon participants-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">Participantes (Total)</span>
                            <span className="stat-value">{totalInteractions}</span>
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
                            <span className="stat-value">{totalHours}</span>
                        </div>
                    </div>
                </section>

                {/* Debates List */}
                <section className="debates-section">
                    <h2>Debates Recientes</h2>
                    {history.length === 0 ? (
                        <p className="no-history">No tienes debates registrados en el historial.</p>
                    ) : (
                        <div className="debates-list">
                            {history.map((debate) => (
                                <div key={debate.id} className="debate-card">
                                    <div className="debate-header">
                                        <div className="debate-title-section">
                                            <h3>{debate.titulo}</h3>
                                            <span className={`debate-type ${debate.tipo_sala === 'General' ? 'general' : 'private'}`}>
                                                {debate.tipo_sala}
                                            </span>
                                        </div>
                                        <span className="debate-date">
                                            {new Date(debate.creada_en).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="debate-summary">
                                        {debate.descripcion}
                                    </p>
                                    {debate.acuerdo_alcanzado && (
                                        <div className="debate-agreement">
                                            <strong>Acuerdo:</strong> {debate.acuerdo_alcanzado}
                                        </div>
                                    )}
                                    <div className="debate-meta">
                                        <div className="meta-item">
                                            <svg viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                            <span>{debate.total_participantes} Participantes</span>
                                        </div>
                                        <div className="meta-item">
                                            <svg viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                            </svg>
                                            <span>
                                                {Math.floor((debate.duracion_real || 0) / 60)} min {(debate.duracion_real || 0) % 60} s
                                            </span>
                                        </div>
                                    </div>
                                    <div className="debate-actions">
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate(`/debate/${debate.id}`)}
                                        >
                                            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', marginRight: '8px' }}>
                                                <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                            </svg>
                                            Ver Detalles del Debate
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
