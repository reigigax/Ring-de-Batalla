import './Toggle.css'

export function Toggle({
    id,
    label,
    description,
    checked,
    onChange,
    disabled = false
}) {
    return (
        <div className="toggle-container">
            <div className="toggle-content">
                <div className="toggle-text">
                    <label htmlFor={id} className="toggle-label">
                        {label}
                    </label>
                    {description && (
                        <span className="toggle-description">{description}</span>
                    )}
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-labelledby={id}
                    className={`toggle-switch ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
                    onClick={() => !disabled && onChange(!checked)}
                    disabled={disabled}
                >
                    <span className="toggle-slider" />
                </button>
            </div>
        </div>
    )
}
