import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/DebateHistory.css'

export function DebateHistory() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Datos simulados de historial
  const pastDebates = [
    {
      id: 1,
      name: 'Debate sobre Evaluaciones',
      type: 'general',
      date: '2025-11-12',
      duration: '45 minutos',
      participants: 8,
      summary: 'Se discutieron criterios de evaluación y su impacto en el aprendizaje',
      hasReport: true,
    },
    {
      id: 2,
      name: 'Mediación de Conflicto',
      type: 'private',
      date: '2025-11-10',
      duration: '30 minutos',
      participants: 3,
      summary: 'Resolución de conflicto entre compañeros con éxito',
      hasReport: true,
    },
    {
      id: 3,
      name: 'Planificación Académica',
      type: 'general',
      date: '2025-11-08',
      duration: '60 minutos',
      participants: 12,
      summary: 'Cambios en malla curricular aprobados',
      hasReport: true,
    },
    {
      id: 4,
      name: 'Innovación en Educación',
      type: 'general',
      date: '2025-11-05',
      duration: '55 minutos',
      participants: 6,
      summary: 'Nuevas metodologías educativas discutidas',
      hasReport: false,
    },
  ]

  return (
    <div className="history-container">
      {/* Header */}
      <div className="history-header">
        <button className="button back-button" onClick={() => navigate('/home')}>
          <svg viewBox="0 0 66 43">
            <polygon points="39.58,4.46 44.11,0 66,21.5 44.11,43 39.58,38.54 56.94,21.5"></polygon>
            <polygon points="19.79,4.46 24.32,0 46.21,21.5 24.32,43 19.79,38.54 37.15,21.5"></polygon>
            <polygon points="0,4.46 4.53,0 26.42,21.5 4.53,43 0,38.54 17.36,21.5"></polygon>
          </svg>
          <span>Volver</span>
        </button>
        <h1>Historial de Debates</h1>
        <p className="user-info">
          {user?.name} • {user?.role === 'teacher' ? 'Profesor/a' : 'Estudiante'}
        </p>
      </div>

      {/* Main Content */}
      <div className="history-content">
        {/* Stats Section */}
        <section className="history-stats">
          <div className="stat-card">
            <div className="stat-icon debates-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-label">Debates Participados</span>
              <span className="stat-value">4</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon participants-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-label">Participantes Totales</span>
              <span className="stat-value">29</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon duration-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.99 5V1h-1v4H8.01V1H7v4H3.99V1h-1v4H1v1h2v3H1v1h2v3H1v1h2v4H1v1h2v3h1v-3h3.99v3h1v-3H16v3h1v-3h4v-1h-4v-3h4v-1h-4v-3h4V9h-4V5h4V4h-4v3h-1V5h-3.01V1h-1v4zm-7 3h14v10H4V8z" />
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-label">Tiempo Total</span>
              <span className="stat-value">190 min</span>
            </div>
          </div>
        </section>

        {/* Debates List */}
        <section className="debates-section">
          <h2>Debates Realizados</h2>
          <div className="debates-list">
            {pastDebates.map((debate) => (
              <div key={debate.id} className="debate-card">
                <div className="debate-header">
                  <div className="debate-title-section">
                    <h3>{debate.name}</h3>
                    <span className={`debate-type ${debate.type}`}>
                      {debate.type === 'general' ? 'General' : 'Privada'}
                    </span>
                  </div>
                  <span className="debate-date">{debate.date}</span>
                </div>

                <p className="debate-summary">{debate.summary}</p>

                <div className="debate-meta">
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11.99 5V1h-1v4H8.01V1H7v4H3.99V1h-1v4H1v1h2v3H1v1h2v3H1v1h2v4H1v1h2v3h1v-3h3.99v3h1v-3H16v3h1v-3h4v-1h-4v-3h4v-1h-4v-3h4V9h-4V5h4V4h-4v3h-1V5h-3.01V1h-1v4zm-7 3h14v10H4V8z" />
                    </svg>
                    <span>{debate.duration}</span>
                  </div>
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span>{debate.participants} participantes</span>
                  </div>
                </div>

                <div className="debate-actions">
                  {debate.hasReport && (
                    <button className="action-btn view-report">
                      <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.63-2.04c-.39-.49-1.01-.49-1.4 0-.39.49-.39 1.28 0 1.77l2.34 2.92c.39.49 1.01.49 1.4 0l3.46-4.46c.39-.49.39-1.28 0-1.77-.39-.49-1.01-.49-1.4 0z" />
                      </svg>
                      Ver Reporte
                    </button>
                  )}
                  <button className="action-btn view-details">
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                    Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Profile Section */}
        <section className="profile-section">
          <h2>Tu Perfil</h2>
          <div className="profile-card">
            <div className="profile-header">
              <img src={user?.avatar} alt={user?.name} className="profile-avatar" />
              <div className="profile-info">
                <h3>{user?.name}</h3>
                <p className="profile-email">{user?.email}</p>
                <p className="profile-role">
                  {user?.role === 'teacher' ? 'Profesor/a' : 'Estudiante'}
                </p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-name">Debates Creados</span>
                <span className="stat-number">2</span>
              </div>
              <div className="profile-stat">
                <span className="stat-name">Debates Participados</span>
                <span className="stat-number">4</span>
              </div>
              <div className="profile-stat">
                <span className="stat-name">Miembro Desde</span>
                <span className="stat-number">Nov 2025</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
