import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { roomService } from '../../services/roomService'
import './Ring.css'

export function Ring() {
    const { roomId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [room, setRoom] = useState(null)
    const [participants, setParticipants] = useState([])
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [duration, setDuration] = useState(0)
    const [showEndModal, setShowEndModal] = useState(false)
    const [agreement, setAgreement] = useState('')
    const [isEnding, setIsEnding] = useState(false)

    // Cargar datos de la sala
    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                // En una implementación real, aquí cargaríamos los detalles de la sala desde la API
                // Por ahora usamos los datos básicos que tenemos o simulamos
                // TODO: Implementar endpoint GET /api/salas/:id para obtener detalles completos

                // Simulamos obtener datos básicos
                const rooms = await roomService.getAll();
                const currentRoom = rooms.find(r => r.id === roomId);

                if (currentRoom) {
                    setRoom(currentRoom);
                } else {
                    // Si no está en la lista (ej. recarga), redirigir o mostrar error
                    // Por simplicidad, redirigimos
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error al cargar sala:', error);
            }
        };

        fetchRoomData();
    }, [roomId, navigate]);

    // Timer para duración del debate
    useEffect(() => {
        const interval = setInterval(() => {
            setDuration(prev => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleLeaveRoom = () => {
        navigate('/dashboard')
    }

    const handleEndDebate = async () => {
        if (!agreement.trim()) {
            alert('Por favor ingresa el acuerdo alcanzado o conclusiones.');
            return;
        }

        setIsEnding(true);
        try {
            await roomService.end(roomId.replace('room-', ''), {
                acuerdo: agreement,
                duracion: duration,
                chatHistory: messages
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al finalizar debate:', error);
            alert('Error al finalizar el debate');
        } finally {
            setIsEnding(false);
        }
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (newMessage.trim()) {
            const message = {
                id: Date.now(),
                user: user?.nombre || user?.name,
                avatar: user?.foto_perfil || user?.avatar,
                text: newMessage,
                timestamp: new Date()
            }
            setMessages([...messages, message])
            setNewMessage('')
        }
    }

    if (!room) {
        return <div className="ring-loading">Cargando sala...</div>
    }

    const isCreator = user?.id === room.creador_id;

    return (
        <div className="ring-container">
            {/* Header */}
            <header className="ring-header">
                <div className="ring-header-content">
                    <div className="ring-info">
                        <h1>{room.name}</h1>
                        <span className={`room-badge ${room.type}`}>
                            {room.type === 'general' ? 'General' : 'Privada'}
                        </span>
                    </div>
                    <div className="ring-header-actions">
                        <div className="ring-timer">
                            <svg viewBox="0 0 24 24" className="timer-icon">
                                <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                            <span>{formatDuration(duration)}</span>
                        </div>

                        {isCreator && (
                            <Button variant="primary" onClick={() => setShowEndModal(true)}>
                                Finalizar Debate
                            </Button>
                        )}

                        <Button variant="danger" onClick={handleLeaveRoom}>
                            Salir
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="ring-main">
                {/* Debate Area */}
                <div className="debate-area">
                    <div className="debate-placeholder">
                        <div className="debate-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                            </svg>
                        </div>
                        <h2>Sala de Debate Activa</h2>
                        <p>Integración de video/audio próximamente</p>
                    </div>

                    {/* Controls */}
                    <div className="debate-controls">
                        <button className="control-btn" title="Micrófono">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                <path fill="currentColor" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            </svg>
                        </button>
                        <button className="control-btn" title="Levantar mano">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83s1.26-1.23 1.3-1.25c.22-.19.49-.29.79-.29.22 0 .42.06.6.16.04.01 4.31 2.46 4.31 2.46V4c0-.83.67-1.5 1.5-1.5S11 3.17 11 4v7h1V1.5c0-.83.67-1.5 1.5-1.5S15 .67 15 1.5V11h1V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h1V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="ring-sidebar">
                    {/* Participants */}
                    <div className="participants-section">
                        <h3>Participantes ({participants.length})</h3>
                        <div className="participants-list">
                            {participants.map(participant => (
                                <div key={participant.id} className="participant-card">
                                    <img src={participant.avatar} alt={participant.name} className="participant-avatar" />
                                    <div className="participant-info">
                                        <span className="participant-name">{participant.name}</span>
                                        <span className="participant-role">
                                            {participant.role === 'teacher' ? '👨‍🏫 Profesor' : '🎓 Estudiante'}
                                        </span>
                                    </div>
                                    <div className={`participant-status ${participant.status}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="chat-section">
                        <h3>Chat</h3>
                        <div className="chat-messages">
                            {messages.length === 0 ? (
                                <p className="chat-empty">No hay mensajes aún</p>
                            ) : (
                                messages.map(message => (
                                    <div key={message.id} className="chat-message">
                                        <img src={message.avatar} alt={message.user} className="message-avatar" />
                                        <div className="message-content">
                                            <span className="message-user">{message.user}</span>
                                            <p className="message-text">{message.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <form className="chat-input" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit">
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </aside>
            </div>

            {/* End Debate Modal */}
            {showEndModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Finalizar Debate</h2>
                        <p>Por favor, resume los acuerdos alcanzados o conclusiones del debate.</p>
                        <textarea
                            value={agreement}
                            onChange={(e) => setAgreement(e.target.value)}
                            placeholder="Escribe aquí los acuerdos o conclusiones..."
                            rows="5"
                            style={{ width: '100%', margin: '1rem 0', padding: '0.5rem' }}
                        />
                        <div className="modal-actions">
                            <Button variant="secondary" onClick={() => setShowEndModal(false)} disabled={isEnding}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleEndDebate} disabled={isEnding}>
                                {isEnding ? 'Finalizando...' : 'Confirmar y Finalizar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
