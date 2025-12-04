import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { roomService } from '../../services/roomService'
import './Ring.css'
import { useSocket } from '../../context/SocketContext'

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
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [contacts, setContacts] = useState([])
    const [isDebateStarted, setIsDebateStarted] = useState(false)
    const [showCountdown, setShowCountdown] = useState(false)
    const [countdown, setCountdown] = useState(5)
    const [showParticipantEndModal, setShowParticipantEndModal] = useState(false)
    const [finalAgreement, setFinalAgreement] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const socket = useSocket()

    // Cargar datos de la sala y registrarse como participante
    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                // Simulamos obtener datos básicos
                const rooms = await roomService.getAll();
                const currentRoom = rooms.find(r => r.id === roomId);

                if (currentRoom) {
                    setRoom(currentRoom);

                    // Registrarse automáticamente como participante
                    try {
                        await roomService.join(roomId.replace('room-', ''));
                        console.log('Usuario registrado como participante');
                    } catch (joinError) {
                        console.error('Error al registrarse como participante:', joinError);
                        // Continuar de todos modos, el socket también registra
                    }
                } else {
                    // Si no está en la lista (ej. recarga), redirigir o mostrar error
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error al cargar sala:', error);
            }
        };

        fetchRoomData();
    }, [roomId, navigate]);

    // Socket: Join room and listen for real-time events
    useEffect(() => {
        if (socket && user && roomId) {
            const salaId = roomId.replace('room-', '');

            // Join debate room
            socket.emit('join_debate_room', { salaId, userId: user.id });

            // Listen for participants updates
            socket.on('participants_update', (updatedParticipants) => {
                setParticipants(updatedParticipants);
            });

            // Listen for chat messages
            socket.on('chat_message', (message) => {
                setMessages(prev => [...prev, message]);
            });

            // Listen for timer sync
            socket.on('room_timer_sync', ({ elapsedSeconds }) => {
                setDuration(elapsedSeconds);
                setIsDebateStarted(true);
            });

            // Listen for countdown start
            socket.on('debate_countdown_start', () => {
                setShowCountdown(true);
                setCountdown(5);
            });

            // Listen for debate started
            socket.on('debate_started', () => {
                setIsDebateStarted(true);
                setShowCountdown(false);
            });

            // Listen for debate ended
            socket.on('debate_ended', ({ acuerdo }) => {
                console.log('Debate ended event received:', acuerdo);
                setIsDebateStarted(false);
                setFinalAgreement(acuerdo);
                // Show modal for all participants (creator will navigate away)
                setShowParticipantEndModal(true);
            });

            return () => {
                socket.emit('leave_debate_room', { salaId, userId: user.id });
                socket.off('participants_update');
                socket.off('chat_message');
                socket.off('room_timer_sync');
                socket.off('debate_countdown_start');
                socket.off('debate_started');
                socket.off('debate_ended');
            };
        }
    }, [socket, user, roomId]);

    // Countdown effect
    useEffect(() => {
        if (showCountdown && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [showCountdown, countdown]);

    // Timer increment (only when debate is running)
    useEffect(() => {
        if (!isDebateStarted) return;

        const interval = setInterval(() => {
            setDuration(prev => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [isDebateStarted])

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleLeaveRoom = () => {
        if (socket && user && roomId) {
            const salaId = roomId.replace('room-', '');
            socket.emit('leave_debate_room', { salaId, userId: user.id });
        }
        navigate('/dashboard')
    }

    const handleStartDebate = () => {
        if (socket && roomId) {
            const salaId = roomId.replace('room-', '');
            socket.emit('start_debate_timer', { salaId });
        }
    }

    const handleEndDebate = async () => {
        if (!agreement.trim()) {
            alert('Por favor ingresa el acuerdo alcanzado o conclusiones.');
            return;
        }

        setIsEnding(true);
        try {
            const salaId = roomId.replace('room-', '');

            // Close participant modal for moderator (in case it opens)
            setShowParticipantEndModal(false);

            // Emit socket event to end debate
            socket.emit('end_debate_with_agreement', {
                salaId,
                acuerdo: agreement,
                duracion: duration,
                chatHistory: messages
            });

            // Close modal and navigate immediately for moderator
            setShowEndModal(false);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al finalizar debate:', error);
            alert('Error al finalizar el debate');
        } finally {
            setIsEnding(false);
        }
    }

    const handleParticipantClose = () => {
        if (agreedToTerms) {
            navigate('/dashboard');
        } else {
            alert('Por favor acepta los términos acordados para continuar.');
        }
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (newMessage.trim() && socket && roomId) {
            const message = {
                id: Date.now(),
                user: user?.nombre || user?.name,
                avatar: user?.foto_perfil || user?.avatar,
                text: newMessage,
                timestamp: new Date()
            }
            const salaId = roomId.replace('room-', '');
            socket.emit('send_chat_message', { salaId, message });
            setNewMessage('')
        }
    }

    const handleOpenInvite = async () => {
        setShowInviteModal(true);
        try {
            const response = await fetch('http://localhost:3000/api/users', { credentials: 'include' });
            const data = await response.json();
            // Filtrar usuarios que ya están en la sala (simplificado)
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleInvite = async (userId) => {
        try {
            await fetch('http://localhost:3000/api/invitaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ receptorId: userId, salaId: room.id.replace('room-', '') })
            });
            alert('Invitación enviada');
        } catch (error) {
            console.error('Error sending invitation:', error);
            alert('Error al enviar invitación');
        }
    };

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

                        {isCreator && !isDebateStarted && (
                            <Button variant="success" onClick={handleStartDebate}>
                                ▶️ Iniciar Debate
                            </Button>
                        )}

                        {isCreator && isDebateStarted && (
                            <Button variant="primary" onClick={() => setShowEndModal(true)}>
                                Finalizar Debate
                            </Button>
                        )}

                        <Button variant="secondary" onClick={handleOpenInvite} style={{ marginRight: '10px' }}>
                            Invitar
                        </Button>
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
                            {participants.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                                    Esperando participantes...
                                </p>
                            ) : (
                                participants.map(participant => (
                                    <div key={participant.userId} className="participant-card">
                                        <img
                                            src={participant.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.nombre)}&background=3A7CA5&color=fff`}
                                            alt={participant.nombre}
                                            className="participant-avatar"
                                        />
                                        <div className="participant-info">
                                            <span className="participant-name">{participant.nombre}</span>
                                            <span className="participant-role">
                                                {participant.rol === 'Profesor' ? '👨‍🏫 Profesor' :
                                                    participant.rol === 'Alumno' ? '🎓 Estudiante' :
                                                        '👔 Funcionario'}
                                            </span>
                                        </div>
                                        <div className="participant-status active"></div>
                                    </div>
                                ))
                            )}
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

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <h2>Invitar Contactos</h2>
                        <div className="invite-list" style={{ maxHeight: '300px', overflowY: 'auto', margin: '1rem 0' }}>
                            {contacts.map(contact => (
                                <div key={contact.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <img src={contact.foto_perfil || 'https://via.placeholder.com/40'} alt={contact.nombre} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 'bold' }}>{contact.nombre}</p>
                                            <span style={{ fontSize: '0.8rem', color: contact.status === 'online' ? 'green' : 'grey' }}>
                                                {contact.status === 'online' ? 'Conectado' : 'Desconectado'}
                                            </span>
                                        </div>
                                    </div>
                                    <Button size="small" onClick={() => handleInvite(contact.id)}>Invitar</Button>
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                            <Button variant="primary" onClick={handleEndDebate} isLoading={isEnding}>
                                Confirmar y Finalizar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Countdown Modal */}
            {showCountdown && (
                <div className="modal-overlay" style={{ zIndex: 1000 }}>
                    <div className="modal-content" style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ fontSize: '80px', fontWeight: 'bold', color: '#3A7CA5', margin: '20px 0' }}>
                            {countdown}
                        </div>
                        <h2 style={{ margin: '10px 0' }}>El debate comenzará en...</h2>
                        <p style={{ color: '#6b7280' }}>Prepárate para participar</p>
                    </div>
                </div>
            )}

            {/* Participant End Modal */}
            {showParticipantEndModal && (
                <div className="modal-overlay" style={{ zIndex: 1000 }}>
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <h2>🎉 Gracias por tu participación</h2>
                        <p style={{ margin: '20px 0', fontSize: '16px', lineHeight: '1.6' }}>
                            El debate ha finalizado. A continuación se presentan los acuerdos alcanzados:
                        </p>
                        <div style={{
                            background: '#f3f4f6',
                            padding: '15px',
                            borderRadius: '8px',
                            margin: '20px 0',
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}>
                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{finalAgreement}</p>
                        </div>
                        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="agreeTerms" style={{ cursor: 'pointer', fontSize: '14px' }}>
                                Acepto los términos acordados en este debate
                            </label>
                        </div>
                        <div className="modal-actions">
                            <Button variant="primary" onClick={handleParticipantClose}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
