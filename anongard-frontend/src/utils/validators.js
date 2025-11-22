/**
 * Valida un correo electrónico
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

/**
 * Valida si un campo es requerido (no vacío)
 * @param {string} value 
 * @returns {boolean}
 */
export const isRequired = (value) => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    return true
}

/**
 * Valida la longitud mínima de un texto
 * @param {string} value 
 * @param {number} min 
 * @returns {boolean}
 */
export const minLength = (value, min) => {
    return typeof value === 'string' && value.length >= min
}
