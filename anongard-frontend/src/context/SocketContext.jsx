import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const newSocket = io('http://localhost:3000', {
                withCredentials: true
            });

            newSocket.on('connect', () => {
                console.log('Conectado al servidor de sockets');
                newSocket.emit('register', user.id);
            });

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
