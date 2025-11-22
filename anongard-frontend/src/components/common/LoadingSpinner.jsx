import './LoadingSpinner.css'

/**
 * Loading Spinner Component
 * 
 * Displays a 3D rotating loading animation
 * 
 * @param {Object} props
 * @param {string} [props.size='medium'] - Size: small, medium, large
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.overlay=false] - Show as full-screen overlay
 * @param {string} [props.text] - Optional loading text
 */
export function LoadingSpinner({
    size = 'medium',
    className = '',
    overlay = false,
    text = ''
}) {
    const sizeClass = size !== 'medium' ? `spinner-${size}` : ''
    const containerClasses = overlay ? 'loading-overlay' : 'spinner-wrapper'
    const combinedClasses = [containerClasses, sizeClass, className].filter(Boolean).join(' ')

    return (
        <div className={combinedClasses}>
            <div className="spinner-container">
                <div className="spinner"></div>
                {text && <p className="loading-text">{text}</p>}
            </div>
        </div>
    )
}
