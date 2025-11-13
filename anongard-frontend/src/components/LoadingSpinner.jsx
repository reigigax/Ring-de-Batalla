import '../styles/LoadingSpinner.css'

export function LoadingSpinner() {
  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando...</p>
      </div>
    </div>
  )
}
