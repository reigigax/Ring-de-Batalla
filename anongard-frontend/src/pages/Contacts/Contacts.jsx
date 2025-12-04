import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { Button } from '../../components/common/Button';
import './Contacts.css';

export function Contacts() {
    const [users, setUsers] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('status_update', ({ userId, status }) => {
                setUsers(prevUsers => prevUsers.map(user =>
                    user.id === userId ? { ...user, status } : user
                ));
            });
        }
        return () => {
            if (socket) socket.off('status_update');
        };
    }, [socket]);

    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users', { credentials: 'include' });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return '#4caf50'; // Green
            case 'busy': return '#f44336'; // Red
            default: return '#9e9e9e'; // Grey
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'online': return 'Conectado';
            case 'busy': return 'En Debate';
            default: return 'Desconectado';
        }
    };

    return (
        <div className="contacts-container">
            <h1>Contactos del Colegio</h1>
            <div className="contacts-grid">
                {users.map(user => (
                    <div key={user.id} className="contact-card">
                        <div className="contact-avatar-wrapper">
                            <img src={user.foto_perfil || 'https://via.placeholder.com/150'} alt={user.nombre} className="contact-avatar" />
                            <span
                                className="status-indicator"
                                style={{ backgroundColor: getStatusColor(user.status) }}
                                title={getStatusText(user.status)}
                            ></span>
                        </div>
                        <div className="contact-info">
                            <h3>{user.nombre}</h3>
                            <p className="contact-role">{user.rol}</p>
                            <p className="contact-status-text" style={{ color: getStatusColor(user.status) }}>
                                {getStatusText(user.status)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
