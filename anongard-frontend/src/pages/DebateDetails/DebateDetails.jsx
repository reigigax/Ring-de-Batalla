import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { roomService } from '../../services/roomService'
import './DebateDetails.css'
import anongardLogo from '../../assets/anongard-logo.png'

export function DebateDetails() {
    const { debateId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [debate, setDebate] = useState(null)
    const [participants, setParticipants] = useState([])
    const [chatHistory, setChatHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDebateDetails = async () => {
            try {
                // Fetch debate details
                const response = await fetch(`http://localhost:3000/api/salas/${debateId}`, {
                    credentials: 'include'
                })
                const data = await response.json()
                setDebate(data)

                // Fetch participants
                const participantsRes = await fetch(`http://localhost:3000/api/salas/${debateId}/participantes`, {
                    credentials: 'include'
                })
                const participantsData = await participantsRes.json()
                setParticipants(participantsData)

                // Fetch chat history if available
                const summaryRes = await fetch(`http://localhost:3000/api/resumenes/${debateId}`, {
                    credentials: 'include'
                })
                if (summaryRes.ok) {
                    const summaryData = await summaryRes.json()
                    if (summaryData.chat_export) {
                        try {
                            setChatHistory(JSON.parse(summaryData.chat_export))
                        } catch (e) {
                            console.error('Error parsing chat:', e)
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching debate details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDebateDetails()
    }, [debateId])

    const handleDownloadPDF = async () => {
        try {
            await roomService.downloadPDF(debateId)
        } catch (error) {
            console.error('Error downloading PDF:', error)
            alert('Error al descargar el PDF')
        }
    }

    if (loading) {
        return <div className="debate-details-loading">Cargando detalles...</div>
    }

    if (!debate) {
        return <div className="debate-details-error">No se encontró el debate</div>
    }

    return (
        <div className="debate-details-container">
            {/* Header */}
            <header className="debate-details-header">
                <div className="debate-details-header-content">
                    <Button
                        className="back-button"
                        onClick={() => navigate('/history')}
                        variant="secondary"
                    >
                        ← Volver al Historial
                    </Button>

                    <a href="/home" className="app-title">
                        <img src={anongardLogo} alt="AnonGard" className="shield-icon" width="60" height="60" />
                        <h1>Ring de Batalla</h1>
                    </a>

                    <div className="user-info">
                        <img
                            src={user?.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || 'User')}&background=3A7CA5&color=fff`}
                            alt={user?.nombre}
                            className="user-avatar"
                        />
                        <span>{user?.nombre}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="debate-details-main">
                <div className="debate-details-content">
                    {/* Title Section */}
                    <section className="details-title-section">
                        <div>
                            <h1>{debate.titulo}</h1>
                            <span className={`debate-type-badge ${debate.tipo_sala === 'General' ? 'general' : 'private'}`}>
                                {debate.tipo_sala}
                            </span>
                        </div>
                        {debate.generar_pdf === 1 && (
                            <Button variant="primary" onClick={handleDownloadPDF}>
                                <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                                    <path fill="currentColor" d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
                                </svg>
                                Descargar PDF
                            </Button>
                        )}
                    </section>

                    {/* Info Cards */}
                    <div className="details-info-grid">
                        <div className="info-card">
                            <h3>📅 Fecha</h3>
                            <p>{new Date(debate.creada_en).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                        <div className="info-card">
                            <h3>⏱️ Duración</h3>
                            <p>{Math.floor((debate.duracion_real || 0) / 60)} minutos {(debate.duracion_real || 0) % 60} segundos</p>
                        </div>
                        <div className="info-card">
                            <h3>👥 Participantes</h3>
                            <p>{participants.length} personas</p>
                        </div>
                    </div>

                    {/* Description */}
                    {debate.descripcion && (
                        <section className="details-section">
                            <h2>Descripción</h2>
                            <p>{debate.descripcion}</p>
                        </section>
                    )}

                    {/* Agreement */}
                    {debate.acuerdo_alcanzado && (
                        <section className="details-section agreement-section">
                            <h2>✅ Acuerdos Alcanzados</h2>
                            <div className="agreement-box">
                                <p>{debate.acuerdo_alcanzado}</p>
                            </div>
                        </section>
                    )}

                    {/* Participants List */}
                    <section className="details-section">
                        <h2>Participantes del Debate</h2>
                        <div className="participants-grid">
                            {participants.map(participant => (
                                <div key={participant.id} className="participant-item">
                                    <img
                                        src={participant.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.nombre)}&background=3A7CA5&color=fff`}
                                        alt={participant.nombre}
                                        className="participant-avatar-small"
                                    />
                                    <div>
                                        <p className="participant-name">{participant.nombre}</p>
                                        <span className="participant-role">
                                            {participant.rol === 'Profesor' ? '👨‍🏫 Profesor' :
                                                participant.rol === 'Alumno' ? '🎓 Estudiante' :
                                                    '👔 Funcionario'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Chat History */}
                    {chatHistory.length > 0 && (
                        <section className="details-section">
                            <h2>💬 Historial del Chat</h2>
                            <div className="chat-history">
                                {chatHistory.map((message, index) => (
                                    <div key={index} className="chat-message-item">
                                        <img
                                            src={message.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.user)}&background=3A7CA5&color=fff`}
                                            alt={message.user}
                                            className="message-avatar-small"
                                        />
                                        <div className="message-bubble">
                                            <strong>{message.user}</strong>
                                            <p>{message.text}</p>
                                            <span className="message-time">
                                                {new Date(message.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    )
}
