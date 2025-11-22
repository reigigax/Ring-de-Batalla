import './Sidebar.css'

export function Sidebar({ isOpen, onClose }) {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h3>Menú</h3>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>
            <nav className="sidebar-nav">
                {/* Sidebar items will go here */}
            </nav>
        </aside>
    )
}
