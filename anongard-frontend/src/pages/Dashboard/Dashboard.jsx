import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ConfirmModal } from '../../components/common/ConfirmModal'
import { CreateRoomModal } from '../../components/features/CreateRoomModal'
import { Button } from '../../components/common/Button'
import { roomService } from '../../services/roomService'
import './Dashboard.css'
import anongardLogo from '../../assets/anongard-logo.png'

// Constantes
const ROOM_TYPES = {
    GENERAL: 'general',
    PRIVATE: 'private'
}

const ROOM_STATUS = {
    ACTIVE: 'active',
    SCHEDULED: 'scheduled'
}

const USER_ROLES = {
    TEACHER: 'Profesor', // Mapeado al backend
    STUDENT: 'Alumno',   // Mapeado al backend
    STAFF: 'Funcionario' // Mapeado al backend
}

// Iconos SVG como componentes
const BackIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
)

const HistoryIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.63-2.04c-.39-.49-1.01-.49-1.4 0-.39.49-.39 1.28 0 1.77l2.34 2.92c.39.49 1.01.49 1.4 0l3.46-4.46c.39-.49.39-1.28 0-1.77-.39-.49-1.01-.49-1.4 0z" />
    </svg>
)

const RoomIcon = () => (
    <svg viewBox="0 0 24 24" className="room-icon" aria-hidden="true">
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
    </svg>
)

const ParticipantsIcon = () => (
    <svg viewBox="0 0 24 24" className="stat-icon" aria-hidden="true">
        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
)

const StatusIcon = () => (
    <svg viewBox="0 0 24 24" className="stat-icon" aria-hidden="true">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
)

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
)

const CreateRoomIcon = () => (
    <svg viewBox="0 0 24 24" className="create-icon" aria-hidden="true">
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
)

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" className="security-icon" aria-hidden="true">
        <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
)

const LockIcon = () => (
    <svg viewBox="0 0 24 24" className="security-icon" aria-hidden="true">
        <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </svg>
)

const ClockIcon = () => (
    <svg viewBox="0 0 24 24" className="security-icon" aria-hidden="true">
        <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
)

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
)

// Utilidades
const getRoomColorClass = (room) => {
    if (room.type === ROOM_TYPES.PRIVATE) return 'purple'
    if (room.participants > 4) return 'green'
    return 'blue'
}

const getRoleLabel = (role) => {
    if (role === USER_ROLES.TEACHER) return 'Profesor/a'
    if (role === USER_ROLES.STUDENT) return 'Estudiante'
    if (role === USER_ROLES.STAFF) return 'Funcionario'
    return 'Usuario'
}

const getStatusLabel = (status) => {
    return status === ROOM_STATUS.ACTIVE ? 'En vivo' : 'Próxima'
}

const getRoomTypeLabel = (type) => {
    return type === ROOM_TYPES.GENERAL ? 'General' : 'Privada'
}

export function Dashboard() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null) // ID de la sala a eliminar
    const [rooms, setRooms] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const userName = user?.nombre || user?.displayName || 'Usuario';
    const userAvatar = user?.foto_perfil || user?.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${userName}&background=3A7CA5&color=fff`

    // Cargar salas al montar
    const fetchRooms = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await roomService.getAll()
            setRooms(data)
        } catch (err) {
            console.error('Error fetching rooms:', err)
            setError('No se pudieron cargar las salas')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRooms()
    }, [fetchRooms])

    // Sistema de invitaciones simulado - TODO: Reemplazar con API real
    const userInvitations = useMemo(() => {
        return user?.rol === USER_ROLES.TEACHER ? ['room-2'] : []
    }, [user?.rol])

    // Verificar si el usuario puede acceder a una sala
    const canAccessRoom = useCallback((room) => {
        if (room.type === ROOM_TYPES.GENERAL) return true
        // Si es el creador, siempre puede acceder
        if (user?.id === room.creador_id) return true
        // TODO: Implementar lógica real de invitaciones
        return userInvitations.includes(room.id)
    }, [userInvitations, user?.id])

    // Handlers
    const handleJoinRoom = useCallback(async (room) => {
        if (canAccessRoom(room)) {
            try {
                await roomService.join(room.id.replace('room-', ''));
                navigate(`/ring/${room.id}`)
            } catch (error) {
                console.error('Error al unirse a la sala:', error);
                // Opcional: mostrar error al usuario
                navigate(`/ring/${room.id}`) // Navegar de todos modos por ahora
            }
        }
    }, [canAccessRoom, navigate])

    const handleLogoutClick = useCallback(() => {
        setShowLogoutModal(true)
    }, [])

    const handleConfirmLogout = useCallback(() => {
        setShowLogoutModal(false)
        logout()
        navigate('/')
    }, [logout, navigate])

    const handleCancelLogout = useCallback(() => {
        setShowLogoutModal(false)
    }, [])

    const handleCreateRoom = useCallback(async (roomData) => {
        try {
            // Mapear datos del frontend al backend
            const backendData = {
                titulo: roomData.name,
                descripcion: roomData.description,
                tipo_sala: roomData.type === 'general' ? 'General' : 'Privada',
                reglas: roomData.debateConditions,
                duracion_turno: 90, // Default o agregar campo en el modal
                saveToHistory: roomData.saveToHistory,
                generatePDF: roomData.generatePDF
            }

            await roomService.create(backendData)
            await fetchRooms() // Recargar lista
            setShowCreateRoomModal(false)
        } catch (err) {
            console.error('Error creating room:', err)
            alert('Error al crear la sala: ' + err.message)
        }
    }, [fetchRooms])

    const handleDeleteClick = (roomId) => {
        setShowDeleteConfirm(roomId)
    }

    const handleConfirmDelete = async () => {
        if (!showDeleteConfirm) return
        try {
            await roomService.delete(showDeleteConfirm)
            await fetchRooms()
            setShowDeleteConfirm(null)
        } catch (err) {
            console.error('Error deleting room:', err)
            alert('Error al eliminar la sala')
        }
    }

    const handleBackToHome = useCallback(() => {
        navigate('/home')
    }, [navigate])

    const handleViewHistory = useCallback(() => {
        navigate('/history')
    }, [navigate])

    const handleOpenCreateRoomModal = useCallback(() => {
        setShowCreateRoomModal(true)
    }, [])

    const handleCloseCreateRoomModal = useCallback(() => {
        setShowCreateRoomModal(false)
    }, [])

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="dashboard-header-content">
                    <Button
                        className="home-button"
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
                                <p className="user-role">{getRoleLabel(user?.rol)}</p>
                            </div>
                        </div>

                        <Button
                            className="history-button"
                            onClick={handleViewHistory}
                            icon={<HistoryIcon />}
                            aria-label="Ver historial de debates"
                            title="Ver historial de debates"
                        >
                            <span>Historial</span>
                        </Button>

                        <Button
                            variant="danger"
                            className="logout-button"
                            onClick={handleLogoutClick}
                            aria-label="Cerrar sesión"
                        >
                            Cerrar sesión
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-content">
                    {/* Welcome Section */}
                    <section className="welcome-section" aria-labelledby="welcome-heading">
                        <h2 id="welcome-heading">👋 ¡Bienvenido/a, {userName}!</h2>
                        <p>✨ Has ingresado exitosamente a Ring de Batalla - AnonGard</p>
                    </section>

                    {/* Rooms Section */}
                    <section className="rooms-section" aria-labelledby="rooms-heading">
                        <header className="rooms-header">
                            <h3 id="rooms-heading">Salas Disponibles</h3>
                            <p className="rooms-subtitle">Selecciona una sala para unirte al debate</p>
                        </header>

                        {isLoading ? (
                            <div className="loading-state">Cargando salas...</div>
                        ) : error ? (
                            <div className="error-state">{error}</div>
                        ) : (
                            <div className="rooms-grid" role="list">
                                {rooms.map((room) => {
                                    const colorClass = getRoomColorClass(room)
                                    const isAccessible = canAccessRoom(room)
                                    const isCreator = user?.id === room.creador_id
                                    const buttonLabel = isAccessible ? 'Unirse' : '🔒 Privada'
                                    const buttonTitle = isAccessible
                                        ? `Unirse a ${room.name}`
                                        : 'Sala privada - Requiere invitación'

                                    return (
                                        <article
                                            key={room.id}
                                            className="room-card"
                                            role="listitem"
                                            aria-labelledby={`room-title-${room.id}`}
                                        >
                                            <div className="room-card-inner">
                                                <div className={`room-header ${colorClass}`} aria-hidden="true">
                                                    {isCreator && (
                                                        <button
                                                            className="delete-room-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(room.id);
                                                            }}
                                                            title="Eliminar sala"
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="room-content">
                                                    <div className="room-title-section">
                                                        <h4 id={`room-title-${room.id}`}>{room.name}</h4>
                                                        <span
                                                            className={`badge ${room.type === ROOM_TYPES.GENERAL ? 'badge-general' : 'badge-private'}`}
                                                            aria-label={`Tipo de sala: ${getRoomTypeLabel(room.type)}`}
                                                        >
                                                            {getRoomTypeLabel(room.type)}
                                                        </span>
                                                    </div>

                                                    <p className="room-description">{room.description}</p>

                                                    <dl className="room-stats">
                                                        <div className="stat">
                                                            <ParticipantsIcon />
                                                            <dt className="visually-hidden">Participantes:</dt>
                                                            <dd>{room.participants} participantes</dd>
                                                        </div>
                                                        <div className="stat">
                                                            <StatusIcon />
                                                            <dt className="visually-hidden">Estado:</dt>
                                                            <dd>{getStatusLabel(room.status)}</dd>
                                                        </div>
                                                    </dl>
                                                </div>

                                                <Button
                                                    className="room-join-btn"
                                                    onClick={() => handleJoinRoom(room)}
                                                    disabled={!isAccessible}
                                                    title={buttonTitle}
                                                    aria-label={buttonTitle}
                                                >
                                                    {buttonLabel}
                                                </Button>
                                            </div>
                                        </article>
                                    )
                                })}

                                {/* Empty State - Create New Room */}
                                <article className="room-card empty-room" role="listitem">
                                    <div className="room-card-inner">
                                        <div className="empty-room-content">
                                            <div className="empty-room-icon" aria-hidden="true">
                                                <PlusIcon />
                                            </div>
                                            <h4>Crear nueva sala</h4>
                                            <p>Inicia tu propio debate</p>
                                            <Button
                                                className="room-create-btn"
                                                onClick={handleOpenCreateRoomModal}
                                                aria-label="Crear nueva sala de debate"
                                            >
                                                Crear Sala
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        )}
                    </section>

                    {/* Create Room Section - Only for Teachers */}
                    {(user?.rol === USER_ROLES.TEACHER || user?.rol === USER_ROLES.STAFF) && (
                        <section className="create-room-section" aria-labelledby="moderator-heading">
                            <h3 id="moderator-heading">👨‍🏫 Opciones de Moderador</h3>
                            <div className="create-room-card">
                                <div className="create-room-content">
                                    <CreateRoomIcon />
                                    <div>
                                        <h4>Crear Sala Privada</h4>
                                        <p>Como profesor/funcionario, puedes crear salas privadas para debates especializados o mediaciones</p>
                                    </div>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handleOpenCreateRoomModal}
                                    aria-label="Crear sala privada"
                                >
                                    Crear Sala
                                </Button>
                            </div>
                        </section>
                    )}

                    {/* Security Section */}
                    <section className="security-section" aria-labelledby="security-heading">
                        <header className="security-header">
                            <h3 id="security-heading">Seguridad y Privacidad</h3>
                            <p className="security-subtitle">Tu información está protegida en todo momento</p>
                        </header>

                        <div className="security-cards" role="list">
                            <article className="security-card" role="listitem">
                                <div className="security-icon-wrapper" aria-hidden="true">
                                    <ShieldIcon />
                                </div>
                                <h4>Datos Protegidos</h4>
                                <p>Tu información está cifrada y protegida según normativas de privacidad</p>
                            </article>

                            <article className="security-card" role="listitem">
                                <div className="security-icon-wrapper" aria-hidden="true">
                                    <LockIcon />
                                </div>
                                <h4>Sin Grabaciones</h4>
                                <p>No se almacenan grabaciones de audio o video de los debates</p>
                            </article>

                            <article className="security-card" role="listitem">
                                <div className="security-icon-wrapper" aria-hidden="true">
                                    <ClockIcon />
                                </div>
                                <h4>Datos Efímeros</h4>
                                <p>Las transcripciones se procesan y eliminan automáticamente</p>
                            </article>
                        </div>
                    </section>
                </div>
            </main>

            {/* Modals */}
            <ConfirmModal
                isOpen={showLogoutModal}
                title="Cerrar sesión"
                message="¿Deseas cerrar la sesión?"
                confirmText="Sí, cerrar sesión"
                cancelText="No, volver"
                isDangerous={true}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />

            <ConfirmModal
                isOpen={!!showDeleteConfirm}
                title="Eliminar Sala"
                message="¿Estás seguro de que deseas eliminar esta sala? Esta acción no se puede deshacer."
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                isDangerous={true}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteConfirm(null)}
            />

            <CreateRoomModal
                isOpen={showCreateRoomModal}
                onClose={handleCloseCreateRoomModal}
                onCreateRoom={handleCreateRoom}
            />
        </div>
    )
}