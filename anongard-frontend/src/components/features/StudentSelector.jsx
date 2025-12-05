import { useState, useEffect } from 'react'
import './StudentSelector.css'

const MOCK_STUDENTS = [
    { id: '1', name: 'Ana García', email: 'ana.garcia@example.com' },
    { id: '2', name: 'Carlos Rodríguez', email: 'carlos.rodriguez@example.com' },
    { id: '3', name: 'María López', email: 'maria.lopez@example.com' },
    { id: '4', name: 'Juan Martínez', email: 'juan.martinez@example.com' },
    { id: '5', name: 'Laura Fernández', email: 'laura.fernandez@example.com' },
    { id: '6', name: 'Pedro Sánchez', email: 'pedro.sanchez@example.com' },
    { id: '7', name: 'Sofia Torres', email: 'sofia.torres@example.com' },
    { id: '8', name: 'Diego Ramírez', email: 'diego.ramirez@example.com' },
]

export function StudentSelector({ selectedStudents = [], onStudentsChange, disabled = false }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [students, setStudents] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setStudents(MOCK_STUDENTS)
    }, [])

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleToggleStudent = (studentId) => {
        if (disabled) return

        const isSelected = selectedStudents.includes(studentId)
        if (isSelected) {
            onStudentsChange(selectedStudents.filter(id => id !== studentId))
        } else {
            onStudentsChange([...selectedStudents, studentId])
        }
    }

    const handleRemoveStudent = (studentId) => {
        if (disabled) return
        onStudentsChange(selectedStudents.filter(id => id !== studentId))
    }

    const getSelectedStudentsData = () => {
        return students.filter(student => selectedStudents.includes(student.id))
    }

    return (
        <div className="student-selector">
            <div className="student-search">
                <svg className="search-icon" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar estudiantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={disabled}
                />
            </div>

            {selectedStudents.length > 0 && (
                <div className="selected-students">
                    <span className="selected-label">
                        Seleccionados ({selectedStudents.length}):
                    </span>
                    <div className="student-chips">
                        {getSelectedStudentsData().map(student => (
                            <div key={student.id} className="student-chip">
                                <span className="chip-name">{student.name}</span>
                                <button
                                    type="button"
                                    className="chip-remove"
                                    onClick={() => handleRemoveStudent(student.id)}
                                    disabled={disabled}
                                    aria-label={`Remover ${student.name}`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="student-list">
                {isLoading ? (
                    <div className="student-list-empty">Cargando estudiantes...</div>
                ) : filteredStudents.length === 0 ? (
                    <div className="student-list-empty">
                        {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes disponibles'}
                    </div>
                ) : (
                    filteredStudents.map(student => {
                        const isSelected = selectedStudents.includes(student.id)
                        return (
                            <div
                                key={student.id}
                                className={`student-item ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                                onClick={() => handleToggleStudent(student.id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleStudent(student.id)}
                                    disabled={disabled}
                                    aria-label={`Seleccionar ${student.name}`}
                                />
                                <div className="student-info">
                                    <span className="student-name">{student.name}</span>
                                    <span className="student-email">{student.email}</span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
