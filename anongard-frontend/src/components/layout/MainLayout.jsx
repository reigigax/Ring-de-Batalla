import { Navbar } from './Navbar'
import './MainLayout.css'

export function MainLayout({ children, className = '' }) {
    return (
        <div className={`main-layout ${className}`}>
            <Navbar />
            <main className="main-content">
                {children}
            </main>
        </div>
    )
}
