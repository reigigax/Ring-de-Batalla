import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ConfirmModal } from './ConfirmModal'
import '../styles/CreateRoomModal.css'

export function CreateRoomModal({ isOpen, onClose, onCreateRoom }) {
  const { user } = useAuth()
  const [roomName, setRoomName] = useState('')
  const [roomDescription, setRoomDescription] = useState('')
  const [roomType, setRoomType] = useState('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validaciones
    if (!roomName.trim()) {
      setError('El nombre de la sala es obligatorio')
      return
    }

    if (roomName.length > 50) {
      setError('El nombre no puede exceder 50 caracteres')
      return
    }

    if (roomDescription.length > 200) {
      setError('La descripción no puede exceder 200 caracteres')
      return
    }

    // Estudiantes solo pueden crear salas generales
    if (user?.role === 'student' && roomType === 'private') {
      setError('Solo los profesores pueden crear salas privadas')
      return
    }

    setIsSubmitting(true)

    try {
      // Simular delay de creación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newRoom = {
        id: `room-${Date.now()}`,
        name: roomName,
        description: roomDescription,
        type: roomType,
        createdBy: user?.name,
        participants: 1,
        createdAt: new Date().toISOString(),
      }

      onCreateRoom(newRoom)
      
      // Reset form
      setRoomName('')
      setRoomDescription('')
      setRoomType('general')
      onClose()
    } catch (err) {
      setError('Error al crear la sala. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRoomName('')
    setRoomDescription('')
    setRoomType('general')
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content create-room-modal">
        <button className="modal-close-btn" onClick={handleClose}>
          ✕
        </button>

        <h2 className="modal-title">Crear Nueva Sala</h2>

        <form onSubmit={handleSubmit}>
          {/* Room Name */}
          <div className="form-group">
            <label htmlFor="roomName">Nombre de la Sala *</label>
            <input
              id="roomName"
              type="text"
              placeholder="Ej: Debate sobre evaluaciones"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              maxLength="50"
              disabled={isSubmitting}
            />
            <span className="char-count">{roomName.length}/50</span>
          </div>

          {/* Room Description */}
          <div className="form-group">
            <label htmlFor="roomDescription">Descripción (opcional)</label>
            <textarea
              id="roomDescription"
              placeholder="Describe el tema o propósito de la sala..."
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              maxLength="200"
              rows="3"
              disabled={isSubmitting}
            />
            <span className="char-count">{roomDescription.length}/200</span>
          </div>

          {/* Room Type */}
          <div className="form-group">
            <label>Tipo de Sala *</label>
            <div className="room-type-options">
              <div className="room-type-option">
                <input
                  type="radio"
                  id="generalRoom"
                  value="general"
                  checked={roomType === 'general'}
                  onChange={(e) => setRoomType(e.target.value)}
                  disabled={isSubmitting}
                />
                <label htmlFor="generalRoom" className="type-label">
                  <span className="type-name">Sala General</span>
                  <span className="type-desc">Cualquier miembro puede unirse</span>
                </label>
              </div>

              <div className="room-type-option">
                <input
                  type="radio"
                  id="privateRoom"
                  value="private"
                  checked={roomType === 'private'}
                  onChange={(e) => setRoomType(e.target.value)}
                  disabled={isSubmitting || user?.role === 'student'}
                />
                <label
                  htmlFor="privateRoom"
                  className={`type-label ${user?.role === 'student' ? 'disabled' : ''}`}
                >
                  <span className="type-name">Sala Privada</span>
                  <span className="type-desc">
                    {user?.role === 'student'
                      ? 'Solo disponible para profesores'
                      : 'Acceso restringido por invitación'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="button secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="button primary"
              disabled={isSubmitting || !roomName.trim()}
            >
              <span>{isSubmitting ? 'Creando...' : 'Crear Sala'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
