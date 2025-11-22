import React from 'react'
import '../../styles/buttons.css'

/**
 * Componente de Botón Reutilizable
 * 
 * @param {Object} props
 * @param {string} [props.variant='primary'] - Variantes: primary, secondary, success, danger, google, microsoft
 * @param {string} [props.size='medium'] - Tamaños: small, medium, large
 * @param {boolean} [props.isLoading=false] - Muestra estado de carga
 * @param {React.ReactNode} [props.icon] - Icono opcional a la izquierda
 * @param {string} [props.className] - Clases adicionales
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {function} [props.onClick] - Manejador de click
 * @param {boolean} [props.disabled] - Estado deshabilitado
 * @param {string} [props.type='button'] - Tipo de botón HTML
 */
export const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    icon,
    className = '',
    disabled,
    type = 'button',
    onClick,
    ...props
}) => {
    // Construir clases CSS
    const baseClass = 'button'
    const variantClass = variant ? variant : ''
    const sizeClass = size !== 'medium' ? size : ''
    const loadingClass = isLoading ? 'loading' : ''

    const combinedClasses = [
        baseClass,
        variantClass,
        sizeClass,
        loadingClass,
        className
    ].filter(Boolean).join(' ')

    return (
        <button
            className={combinedClasses}
            disabled={disabled || isLoading}
            type={type}
            onClick={onClick}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="spinner-small"></span>
                    <span>Cargando...</span>
                </>
            ) : (
                <>
                    {icon && <span className="btn-icon">{icon}</span>}
                    <span>{children}</span>
                    {/* SVG Effects from buttons.css */}
                    <svg viewBox="0 0 66 43" height="10px" width="15px">
                        <polygon points="39.58,4.46 44.11,0 66,21.5 44.11,43 39.58,38.54 56.94,21.5"></polygon>
                        <polygon points="19.79,4.46 24.32,0 46.21,21.5 24.32,43 19.79,38.54 37.15,21.5"></polygon>
                        <polygon points="0,4.46 4.53,0 26.42,21.5 4.53,43 0,38.54 17.36,21.5"></polygon>
                    </svg>
                </>
            )}
        </button>
    )
}
