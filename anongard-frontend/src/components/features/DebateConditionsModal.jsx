import { useState } from 'react'
import { Button } from '../common/Button'
import './DebateConditionsModal.css'

export function DebateConditionsModal({ isOpen, conditions, roomName, onAccept, onCancel }) {
    const [accepted, setAccepted] = useState(false)

    if (!isOpen) return null

    const handleAccept = () => {
        if (accepted) {
            onAccept()
        }
    }

    const handleClose = () => {
        setAccepted(false)
        onCancel()
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content debate-conditions-modal">
                <button className="modal-close-btn" onClick={handleClose}>
                    ✕
                </button>

                <div className="conditions-header">
                    <svg className="conditions-icon" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                        />
                    </svg>
                    <h2 className="modal-title">Condiciones del Debate</h2>
                    <p className="room-name">{roomName}</p>
                </div>

                <div className="conditions-content">
                    <p className="conditions-intro">
                        Antes de unirte a esta sala, debes leer y aceptar las siguientes condiciones:
                    </p>

                    <div className="conditions-text">
                        {conditions}
                    </div>
                </div>

                <div className="conditions-acceptance">
                    <label className="acceptance-checkbox">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                        />
                        <span className="acceptance-text">
                            He leído y acepto las condiciones del debate
                        </span>
                    </label>
                </div>

                <div className="form-actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleAccept}
                        disabled={!accepted}
                    >
                        Aceptar y Unirse
                    </Button>
                </div>
            </div>
        </div>
    )
}
