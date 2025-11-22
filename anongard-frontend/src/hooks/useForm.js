import { useState } from 'react'

/**
 * Hook personalizado para manejar formularios
 * @param {Object} initialState - Estado inicial del formulario
 * @param {Function} validate - Función de validación opcional
 * @returns {Object} - { values, errors, handleChange, handleSubmit, resetForm }
 */
export function useForm(initialState = {}, validate) {
    const [values, setValues] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value,
        })
    }

    const handleSubmit = async (onSubmit) => {
        setIsSubmitting(true)

        if (validate) {
            const validationErrors = validate(values)
            setErrors(validationErrors)

            if (Object.keys(validationErrors).length > 0) {
                setIsSubmitting(false)
                return
            }
        }

        try {
            await onSubmit(values)
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setValues(initialState)
        setErrors({})
    }

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
        setValues,
    }
}
