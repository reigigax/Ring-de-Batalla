/**
 * Servicio de autenticación simulado (Mock)
 * En producción, esto se conectará al backend real
 */

// Datos simulados de usuarios
const MOCK_USERS = {
  google: {
    id: 'google-user-001',
    email: 'hsanhueza@anongard.cl',
    name: 'Hector Sanhueza',
    provider: 'google',
    role: 'student', // 'student' o 'teacher'
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hector',
  },
  microsoft: {
    id: 'google-user-001',
    email: 'hsanhueza@anongard.cl',
    name: 'Hector Sanhueza',
    provider: 'microsoft',
    role: 'teacher', // 'student' o 'teacher'
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hector',
  },
}

/**
 * Genera un token JWT simulado
 * @param {Object} user - Datos del usuario
 * @returns {string} Token simulado
 */
function generateMockToken(user) {
  // En realidad es un objeto JSON encoded en base64 (no es un JWT real, pero simula uno)
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 * 24, // 24 horas
  }
  return btoa(JSON.stringify(payload))
}

/**
 * Simula el login con Google
 * @returns {Promise<Object>} Datos de usuario y token
 */
export async function loginWithGoogle() {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const user = MOCK_USERS.google
  const accessToken = generateMockToken(user)
  const refreshToken = generateMockToken({ ...user, type: 'refresh' })

  return {
    user,
    accessToken,
    refreshToken,
  }
}

/**
 * Simula el login con Microsoft
 * @returns {Promise<Object>} Datos de usuario y token
 */
export async function loginWithMicrosoft() {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const user = MOCK_USERS.microsoft
  const accessToken = generateMockToken(user)
  const refreshToken = generateMockToken({ ...user, type: 'refresh' })

  return {
    user,
    accessToken,
    refreshToken,
  }
}

/**
 * Valida un token y retorna los datos del usuario
 * @param {string} token - Token a validar
 * @returns {Object|null} Datos del usuario o null si el token es inválido
 */
export function validateToken(token) {
  try {
    const payload = JSON.parse(atob(token))
    const now = Math.floor(Date.now() / 1000)

    // Verificar que no esté expirado
    if (payload.exp && payload.exp < now) {
      return null
    }

    return payload
  } catch (error) {
    console.error('Error validando token:', error)
    return null
  }
}

/**
 * Obtiene el usuario actualmente autenticado desde localStorage
 * @returns {Object|null} Datos del usuario o null
 */
export function getCurrentUser() {
  const token = localStorage.getItem('access_token')
  if (!token) return null

  return validateToken(token)
}

/**
 * Simula logout
 */
export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

/**
 * Guarda la sesión en localStorage
 * @param {Object} data - Datos de autenticación (user, accessToken, refreshToken)
 */
export function saveSession(data) {
  localStorage.setItem('access_token', data.accessToken)
  localStorage.setItem('refresh_token', data.refreshToken)
  localStorage.setItem('user', JSON.stringify(data.user))
}

/**
 * Verifica si hay una sesión activa
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = localStorage.getItem('access_token')
  return token !== null && validateToken(token) !== null
}
