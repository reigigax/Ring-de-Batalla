import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ConfirmModal } from './ConfirmModal'
import { CreateRoomModal } from './CreateRoomModal'
import '../styles/Dashboard.css'
import anongardLogo from '../assets/anongard-logo.png'


export function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
  const [rooms, setRooms] = useState([
    {
      id: 'room-1',
      name: 'Debate sobre Evaluaciones',
      description: 'Discusión sobre criterios de evaluación y metodologías',
      type: 'general',
      participants: 3,
      status: 'active',
    },
    {
      id: 'room-2',
      name: 'Mediación de Conflicto',
      description: 'Resolución de conflictos entre estudiantes (acceso restringido)',
      type: 'private',
      participants: 2,
      status: 'scheduled',
    },
    {
      id: 'room-3',
      name: 'Planificación Académica',
      description: 'Cambios en la malla curricular y planificación semestral',
      type: 'general',
      participants: 5,
      status: 'active',
    },
  ])

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleConfirmLogout = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/')
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  const handleCreateRoom = (newRoom) => {
    setRooms([newRoom, ...rooms])
    setShowCreateRoomModal(false)
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <button
            className="home-button"
            onClick={() => navigate('/home')}
            title="Volver al inicio"
          >
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </button>

          <div className="app-title">
            <img
              src={anongardLogo}
              alt="AnonGard Logo"
              className="shield-icon"
              style={{ width: '80px', height: 'auto' }}
            />
            <h1>Ring de Batalla</h1>
          </div>

          <div className="user-menu">
            <div className="user-info">
              <img src={user?.avatar} alt={user?.name} className="user-avatar" />
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">
                  {user?.role === 'teacher' ? 'Profesor/a' : 'Estudiante'}
                </p>
              </div>
            </div>
            <button
              className="history-button"
              onClick={() => navigate('/history')}
              title="Ver historial de debates"
            >
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.63-2.04c-.39-.49-1.01-.49-1.4 0-.39.49-.39 1.28 0 1.77l2.34 2.92c.39.49 1.01.49 1.4 0l3.46-4.46c.39-.49.39-1.28 0-1.77-.39-.49-1.01-.49-1.4 0z"
                />
              </svg>
            </button>
            <button className="logout-button" onClick={handleLogoutClick}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>👋 ¡Bienvenido/a, {user?.name}!</h2>
            <p>✨ Has ingresado exitosamente a Ring de Batalla - AnonGard</p>
          </section>

          {/* Rooms Section */}
          <section className="rooms-section">
            <div className="rooms-header">
              <h3>Salas Disponibles</h3>
              <p className="rooms-subtitle">Selecciona una sala para unirte al debate</p>
            </div>
            <div className="rooms-grid">
              {rooms.map((room) => {
                const colorClass =
                  room.type === 'private'
                    ? 'purple'
                    : room.participants > 4
                      ? 'green'
                      : 'blue'

                return (
                  <div key={room.id} className="room-card">
                    <div className="room-card-inner">
                      <div className={`room-header ${colorClass}`}>
                        <svg viewBox="0 0 24 24" className="room-icon">
                          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                        </svg>
                      </div>
                      <div className="room-content">
                        <div className="room-title-section">
                          <h4>{room.name}</h4>
                          <span
                            className={`badge ${room.type === 'general' ? 'badge-general' : 'badge-private'}`}
                          >
                            {room.type === 'general' ? 'General' : 'Privada'}
                          </span>
                        </div>
                        <p className="room-description">{room.description}</p>

                        <div className="room-stats">
                          <div className="stat">
                            <svg viewBox="0 0 24 24" className="stat-icon">
                              <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            <span>{room.participants} participantes</span>
                          </div>
                          <div className="stat">
                            <svg viewBox="0 0 24 24" className="stat-icon">
                              <circle cx="12" cy="12" r="2" fill="currentColor" />
                              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>{room.status === 'active' ? 'En vivo' : 'Próxima'}</span>
                          </div>
                        </div>
                      </div>
                      <button className="room-join-btn">
                        <span>Unirse</span>
                        <svg viewBox="0 0 24 24">
                          <path fill="currentColor" d="M8 5v14h11V5H8zm9 12H9v-2h8v2zm0-4H9V9h8v4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Room Card - Empty State - Create New */}
              <div className="room-card empty-room">
                <div className="room-card-inner">
                  <div className="empty-room-content">
                    <div className="empty-room-icon">
                      <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                    </div>
                    <h4>Crear nueva sala</h4>
                    <p>Inicia tu propio debate</p>
                    <button className="room-create-btn" onClick={() => setShowCreateRoomModal(true)}>
                      <span>Crear Sala</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Create Room Section - Only for Teachers */}
          {user?.role === 'teacher' && (
            <section className="create-room-section">
              <h3>👨‍🏫 Opciones de Moderador</h3>
              <div className="create-room-card">
                <div className="create-room-content">
                  <svg viewBox="0 0 24 24" className="create-icon">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                  </svg>
                  <div>
                    <h4>Crear Sala Privada</h4>
                    <p>Como profesor, puedes crear salas privadas para debates especializados o mediaciones</p>
                  </div>
                </div>
                <button className="primary-button" onClick={() => setShowCreateRoomModal(true)}>
                  Crear Sala
                </button>
              </div>
            </section>
          )}

          {/* Security Section */}
          <section className="security-section">
            <div className="security-header">
              <h3>Seguridad y Privacidad</h3>
              <p className="security-subtitle">Tu información está protegida en todo momento</p>
            </div>
            <div className="security-cards">
              <div className="security-card">
                <div className="security-icon-wrapper">
                  <svg viewBox="0 0 24 24" className="security-icon">
                    <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                  </svg>
                </div>
                <h4>Datos Protegidos</h4>
                <p>Tu información está cifrada y protegida según normativas de privacidad</p>
              </div>
              <div className="security-card">
                <div className="security-icon-wrapper">
                  <svg viewBox="0 0 24 24" className="security-icon">
                    <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                  </svg>
                </div>
                <h4>Sin Grabaciones</h4>
                <p>No se almacenan grabaciones de audio o video de los debates</p>
              </div>
              <div className="security-card">
                <div className="security-icon-wrapper">
                  <svg viewBox="0 0 24 24" className="security-icon">
                    <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                </div>
                <h4>Datos Efímeros</h4>
                <p>Las transcripciones se procesan y eliminan automáticamente</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modal de confirmación de logout */}
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

      {/* Modal para crear sala */}
      <CreateRoomModal
        isOpen={showCreateRoomModal}
        onClose={() => setShowCreateRoomModal(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  )
}
