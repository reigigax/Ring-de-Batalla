import './Footer.css'

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-text">
                    © {new Date().getFullYear()} Ring de Batalla - AnonGard. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    )
}
