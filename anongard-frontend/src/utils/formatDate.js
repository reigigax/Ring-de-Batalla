/**
 * Formatea una fecha a un formato legible (ej: 12 Nov 2025)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
    if (!date) return ''

    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

/**
 * Formatea una fecha a formato relativo (ej: hace 5 minutos)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Tiempo relativo
 */
export const timeAgo = (date) => {
    if (!date) return ''

    const seconds = Math.floor((new Date() - new Date(date)) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + ' años'

    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + ' meses'

    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + ' días'

    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + ' horas'

    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + ' minutos'

    return Math.floor(seconds) + ' segundos'
}
