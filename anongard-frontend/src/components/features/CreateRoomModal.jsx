import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../common/Button'
import { Toggle } from '../common/Toggle'
import { StudentSelector } from './StudentSelector'
import './CreateRoomModal.css'


export function CreateRoomModal({ isOpen, onClose, onCreateRoom }) {
    const { user } = useAuth()

    const [roomName, setRoomName] = useState('')
    const [roomDescription, setRoomDescription] = useState('')
    const [roomType, setRoomType] = useState('general')

    const [maxParticipants, setMaxParticipants] = useState('10')
    const [selectedStudents, setSelectedStudents] = useState([])
    const [debateConditions, setDebateConditions] = useState('')
    const [saveToHistory, setSaveToHistory] = useState(true)
    const [generatePDF, setGeneratePDF] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

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

        if (user?.rol === 'Alumno' && roomType === 'private') {
            setError('Solo los profesores pueden crear salas privadas')
            return
        }

        if (roomType === 'general') {
            if (!maxParticipants || maxParticipants.trim() === '') {
                setError('El límite de participantes es obligatorio para salas generales')
                return
            }
            const limit = parseInt(maxParticipants)
            if (isNaN(limit) || limit < 2) {
                setError('El límite de participantes debe ser al menos 2')
                return
            }
            if (limit > 15) {
                setError('El límite de participantes no puede exceder 15')
                return
            }
        }

        if (roomType === 'private' && selectedStudents.length === 0) {
            setError('Debes invitar al menos un estudiante a la sala privada')
            return
        }

        if (!debateConditions.trim()) {
            setError('Las condiciones del debate son obligatorias')
            return
        }
        if (debateConditions.length > 500) {
            setError('Las condiciones del debate no pueden exceder 500 caracteres')
            return
        }

        setIsSubmitting(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const newRoom = {
                id: `room-${Date.now()}`,
                name: roomName,
                description: roomDescription,
                type: roomType,
                createdBy: user?.nombre,
                participants: 1,
                createdAt: new Date().toISOString(),
                maxParticipants: roomType === 'general' ? parseInt(maxParticipants) : null,
                invitedStudents: roomType === 'private' ? selectedStudents : [],
                debateConditions: debateConditions.trim() || null,
                saveToHistory,
                generatePDF,
            }

            onCreateRoom(newRoom)

            resetForm()
            onClose()
        } catch (err) {
            setError('Error al crear la sala. Por favor intenta de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setRoomName('')
        setRoomDescription('')
        setRoomType('general')
        setMaxParticipants('10')
        setSelectedStudents([])
        setDebateConditions('')
        setSaveToHistory(true)
        setGeneratePDF(false)
        setError(null)
    }

    const handleClose = () => {
        resetForm()
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
                                    disabled={isSubmitting || user?.rol === 'Alumno'}
                                />
                                <label
                                    htmlFor="privateRoom"
                                    className={`type-label ${user?.rol === 'Alumno' ? 'disabled' : ''}`}
                                >
                                    <span className="type-name">Sala Privada</span>
                                    <span className="type-desc">
                                        {user?.rol === 'Alumno'
                                            ? 'Solo disponible para profesores'
                                            : 'Acceso restringido por invitación'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {roomType === 'general' && (
                        <div className="form-group">
                            <label htmlFor="maxParticipants">Límite de Participantes *</label>
                            <input
                                id="maxParticipants"
                                type="number"
                                placeholder="Ej: 10"
                                value={maxParticipants}
                                onChange={(e) => setMaxParticipants(e.target.value)}
                                min="2"
                                max="15"
                                disabled={isSubmitting}
                                required
                            />
                            <span className="field-hint">
                                Número máximo de personas que pueden unirse (máximo 15)
                            </span>
                        </div>
                    )}

                    {roomType === 'private' && user?.rol !== 'Alumno' && (
                        <div className="form-group">
                            <label>Invitar Estudiantes *</label>
                            <StudentSelector
                                selectedStudents={selectedStudents}
                                onStudentsChange={setSelectedStudents}
                                disabled={isSubmitting}
                            />
                            <span className="field-hint">
                                Selecciona los estudiantes que podrán unirse a esta sala privada
                            </span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="debateConditions">Condiciones del Debate *</label>
                        <textarea
                            id="debateConditions"
                            placeholder="Escribe las reglas y condiciones que los participantes deben aceptar antes de unirse..."
                            value={debateConditions}
                            onChange={(e) => setDebateConditions(e.target.value)}
                            maxLength="500"
                            rows="4"
                            disabled={isSubmitting}
                            required
                        />
                        <span className="char-count">{debateConditions.length}/500</span>
                        <span className="field-hint">
                            Los participantes deberán aceptar estas condiciones antes de unirse
                        </span>
                    </div>

                    <div className="form-group">
                        <label>Opciones de Configuración</label>
                        <div className="config-options">
                            <Toggle
                                id="saveToHistory"
                                label="Guardar en historial"
                                description="El debate se guardará en el historial de debates"
                                checked={saveToHistory}
                                onChange={setSaveToHistory}
                                disabled={isSubmitting}
                            />
                            <Toggle
                                id="generatePDF"
                                label="Generar reporte PDF"
                                description="Se generará un reporte en PDF al finalizar el debate"
                                checked={generatePDF}
                                onChange={setGeneratePDF}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

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

                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            disabled={!roomName.trim()}
                        >
                            Crear Sala
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
