import { Button } from './Button'
import './ConfirmModal.css'

/**
 * Modal de confirmación genérico
 */
export function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Sí',
    cancelText = 'No',
    isDangerous = false
}) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>

                <div className="modal-actions">
                    <Button
                        variant="secondary"
                        className="modal-button modal-cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={isDangerous ? 'danger' : 'primary'}
                        className="modal-button modal-confirm"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}
