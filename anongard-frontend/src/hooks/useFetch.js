import { useState, useEffect, useCallback } from 'react'

/**
 * Hook personalizado para realizar peticiones HTTP
 * @param {string} url - URL a la que hacer la petición
 * @param {Object} options - Opciones de configuración para fetch
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useFetch(url, options = {}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        if (!url) return

        setLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem('access_token')
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(url, {
                ...options,
                headers,
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            const result = await response.json()
            setData(result)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [url, JSON.stringify(options)])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}
