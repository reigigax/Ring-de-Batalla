import { useState } from 'react'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import './SpinnerTest.css'

/**
 * Test page for LoadingSpinner component
 * This is a temporary page to demonstrate the spinner
 */
export function SpinnerTest() {
    const [showOverlay, setShowOverlay] = useState(false)

    return (
        <div className="spinner-test-container">
            <h1>Loading Spinner Test</h1>

            <section className="test-section">
                <h2>Small Spinner</h2>
                <LoadingSpinner size="small" text="Cargando..." />
            </section>

            <section className="test-section">
                <h2>Medium Spinner (Default)</h2>
                <LoadingSpinner text="Procesando..." />
            </section>

            <section className="test-section">
                <h2>Large Spinner</h2>
                <LoadingSpinner size="large" text="Iniciando sesión..." />
            </section>

            <section className="test-section">
                <h2>Overlay Spinner</h2>
                <button
                    className="test-button"
                    onClick={() => {
                        setShowOverlay(true)
                        setTimeout(() => setShowOverlay(false), 3000)
                    }}
                >
                    Show Overlay Spinner (3s)
                </button>
                {showOverlay && <LoadingSpinner overlay text="Cargando datos..." />}
            </section>
        </div>
    )
}
