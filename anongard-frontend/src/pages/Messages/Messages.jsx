import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import './Messages.css';
import anongardLogo from '../../assets/anongard-logo.png';

const BackIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
);

export function Messages() {
    const [invitations, setInvitations] = useState([]);
    const socket = useSocket();
    const navigate = useNavigate();
    const { user } = useAuth();

    const userName = user?.nombre || 'Usuario';
    const userAvatar = user?.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3A7CA5&color=fff`;

    useEffect(() => {
        fetchInvitations();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('invitation_received', (newInvitation) => {
                setInvitations(prev => [newInvitation, ...prev]);
            });
        }
        return () => {
            if (socket) socket.off('invitation_received');
        };
    }, [socket]);

    const fetchInvitations = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/invitaciones/pendientes', { credentials: 'include' });
            const data = await response.json();
            setInvitations(data);
        } catch (error) {
            console.error('Error fetching invitations:', error);
        }
    };

    const handleResponse = async (invitationId, estado, salaId) => {
        try {
            await fetch(`http://localhost:3000/api/invitaciones/${invitationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ estado })
            });

            setInvitations(prev => prev.filter(inv => inv.id !== invitationId));

            if (estado === 'Aceptada') {
                navigate(`/ring/room-${salaId}`);
            }
        } catch (error) {
            console.error('Error responding to invitation:', error);
        }
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    return (
        <div className="messages-container">
            {/* Header */}
            <header className="messages-header">
                <div className="messages-header-content">
                    <Button
                        className="back-button"
                        onClick={handleBackToHome}
                        icon={<BackIcon />}
                        aria-label="Volver a inicio"
                    >
                        <span>Volver</span>
                    </Button>

                    <a href="/home" className="app-title" aria-label="Ring de Batalla - Ir a inicio">
                        <img
                            src={anongardLogo}
                            alt="AnonGard"
                            className="shield-icon"
                            width="80"
                            height="80"
                        />
                        <h1>Ring de Batalla</h1>
                    </a>

                    <nav className="user-menu" aria-label="Menú de usuario">
                        <div className="user-info" role="status" aria-label={`Usuario: ${userName}`}>
                            <img
                                src={userAvatar}
                                alt=""
                                className="user-avatar"
                                width="40"
                                height="40"
                            />
                            <div className="user-details">
                                <p className="user-name">{userName}</p>
                                <p className="user-role">{user?.rol || 'Usuario'}</p>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="messages-main">
                <div className="messages-content">
                    {/* Welcome Section */}
                    <section className="welcome-section" aria-labelledby="welcome-heading">
                        <div className="welcome-icon">
                            <MailIcon />
                        </div>
                        <div>
                            <h2 id="welcome-heading">📬 Mensajes e Invitaciones</h2>
                            <p>Gestiona tus invitaciones a debates</p>
                        </div>
                    </section>

                    {/* Invitations Section */}
                    <section className="invitations-section" aria-labelledby="invitations-heading">
                        <header className="invitations-header">
                            <h3 id="invitations-heading">Invitaciones Pendientes</h3>
                            <span className="invitations-count">{invitations.length} {invitations.length === 1 ? 'invitación' : 'invitaciones'}</span>
                        </header>

                        {invitations.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <MailIcon />
                                </div>
                                <h4>No tienes invitaciones pendientes</h4>
                                <p>Cuando alguien te invite a un debate, aparecerá aquí</p>
                            </div>
                        ) : (
                            <div className="invitations-list">
                                {invitations.map(inv => (
                                    <article key={inv.id} className="invitation-card">
                                        <div className="invitation-card-inner">
                                            <div className="invitation-header">
                                                <img
                                                    src={inv.emisor_foto || inv.emisor?.foto_perfil || 'https://via.placeholder.com/50'}
                                                    alt={inv.emisor_nombre || inv.emisor?.nombre}
                                                    className="invitation-avatar"
                                                />
                                                <div className="invitation-details">
                                                    <p className="invitation-sender">
                                                        <strong>{inv.emisor_nombre || inv.emisor?.nombre}</strong> te ha invitado
                                                    </p>
                                                    <p className="invitation-room">
                                                        <span className="room-badge">📍</span>
                                                        {inv.sala_titulo || inv.sala?.titulo}
                                                    </p>
                                                    <span className="invitation-time">
                                                        {new Date(inv.creada_en).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="invitation-actions">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleResponse(inv.id, 'Rechazada')}
                                                    size="small"
                                                >
                                                    Rechazar
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleResponse(inv.id, 'Aceptada', inv.sala_id || inv.sala?.id)}
                                                    size="small"
                                                >
                                                    Aceptar
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
