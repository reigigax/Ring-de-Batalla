import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import './CompleteRegistration.css';

export function CompleteRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fecha_nacimiento: '',
        comuna: '',
        rol: '',
        curso: '',
        numero_contacto: '',
        nombre_apoderado: '',
        numero_contacto_apoderado: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/complete-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Registro completado exitosamente
                // Recargar la página para que el contexto obtenga los datos actualizados
                window.location.href = '/home';
            } else {
                setError(data.error || 'Error al completar el registro');
                setLoading(false);
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
            console.error('Error:', err);
            setLoading(false);
        }
    };

    return (
        <div className="complete-registration-container">
            <div className="registration-card">
                <div className="registration-header">
                    <h1>Completa tu Registro</h1>
                    <p>Por favor, completa la siguiente información para continuar</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-group">
                        <label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</label>
                        <input
                            type="date"
                            id="fecha_nacimiento"
                            name="fecha_nacimiento"
                            value={formData.fecha_nacimiento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comuna">Comuna *</label>
                        <input
                            type="text"
                            id="comuna"
                            name="comuna"
                            value={formData.comuna}
                            onChange={handleChange}
                            placeholder="Ej: Santiago"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rol">Rol *</label>
                        <select
                            id="rol"
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona tu rol</option>
                            <option value="Alumno">Alumno</option>
                            <option value="Profesor">Profesor</option>
                            <option value="Funcionario">Funcionario</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="curso">Curso</label>
                        <input
                            type="text"
                            id="curso"
                            name="curso"
                            value={formData.curso}
                            onChange={handleChange}
                            placeholder="Ej: 4° Medio A"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="numero_contacto">Número de Contacto *</label>
                        <input
                            type="tel"
                            id="numero_contacto"
                            name="numero_contacto"
                            value={formData.numero_contacto}
                            onChange={handleChange}
                            placeholder="+56 9 1234 5678"
                            required
                        />
                    </div>

                    <div className="form-section-title">
                        <h3>Información del Apoderado</h3>
                        <p className="section-subtitle">(Solo para alumnos)</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="nombre_apoderado">Nombre del Apoderado</label>
                        <input
                            type="text"
                            id="nombre_apoderado"
                            name="nombre_apoderado"
                            value={formData.nombre_apoderado}
                            onChange={handleChange}
                            placeholder="Nombre completo"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="numero_contacto_apoderado">Número de Contacto del Apoderado</label>
                        <input
                            type="tel"
                            id="numero_contacto_apoderado"
                            name="numero_contacto_apoderado"
                            value={formData.numero_contacto_apoderado}
                            onChange={handleChange}
                            placeholder="+56 9 1234 5678"
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Completar Registro'}
                    </button>
                </form>
            </div>

            {/* Loading Spinner Overlay */}
            {loading && <LoadingSpinner overlay text="Guardando información..." />}
        </div>
    );
}
