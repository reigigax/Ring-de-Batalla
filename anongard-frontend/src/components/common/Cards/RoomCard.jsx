import React from 'react';
import PropTypes from 'prop-types';
import './RoomCard.css';
import anongardLogo from '../../../assets/anongard-logo.png';

/**
 * Componente RoomCard
 * Muestra una sala de debate con su estado actual, participantes y acción de unirse.
 * Soporta salas tipo General y Privada con diferentes temas visuales.
 */
const RoomCard = ({
    room,
    onJoin,
    onDelete,
    isCreator = false,
    isAccessible = true
}) => {
    const handleJoin = () => {
        if (isAccessible && onJoin) {
            onJoin(room);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(room.id);
        }
    };

    const getColorClass = () => {
        return room.type === 'Privada' ? 'purple' : 'blue';
    };

    const getStatusInfo = () => {
        if (room.status === 'Activa') {
            return { text: 'En vivo', class: 'active' };
        }
        return { text: 'Disponible', class: 'available' };
    };

    const colorClass = getColorClass();
    const statusInfo = getStatusInfo();

    return (
        <div className={`room-card-modern ${colorClass}`}>
            <div className="room-card-header">
                <div className="header-top">
                    <div className="room-logo">
                        <img
                            src={anongardLogo}
                            alt="AnonGard"
                            className="logo-image"
                        />
                    </div>

                    <div className={`status-badge ${statusInfo.class}`}>
                        <span className="status-dot"></span>
                        <span className="status-text">{statusInfo.text}</span>
                    </div>
                </div>

                <h3 className="room-title">{room.name}</h3>

                <div className="participants-info">
                    <div className="participants-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span className="participants-count">{room.participants}</span>
                    </div>
                    <div className="separator"></div>
                    <span className="participants-label">
                        {room.participants === 1 ? 'participante activo' : 'participantes activos'}
                    </span>
                </div>
            </div>

            <div className="room-card-content">
                {room.description && room.description !== room.name && (
                    <p className="room-description">{room.description}</p>
                )}

                <div className="room-type-badge">
                    <span className="type-icon">{room.type === 'Privada' ? '🔒' : '🏛️'}</span>
                    <span className="type-text">{room.type}</span>
                </div>

                <button
                    onClick={handleJoin}
                    disabled={!isAccessible}
                    className={`join-btn ${!isAccessible ? 'disabled' : ''}`}
                    aria-label={isAccessible ? 'Unirse a la sala' : 'No tienes acceso a esta sala'}
                >
                    <span className="btn-text">Unirse a la Sala</span>
                    <svg className="btn-arrow" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                    <div className="btn-overlay"></div>
                </button>
            </div>

            <div className="glow-effect"></div>
        </div>
    );
};

RoomCard.propTypes = {
    room: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        type: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        participants: PropTypes.number.isRequired,
    }).isRequired,
    onJoin: PropTypes.func,
    onDelete: PropTypes.func,
    isCreator: PropTypes.bool,
    isAccessible: PropTypes.bool,
};

export default RoomCard;
