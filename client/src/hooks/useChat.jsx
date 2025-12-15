import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

// 👇 Ajusta la URL según tu configuración
const URL_SOCKET = import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : window.location.origin;

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket debe usarse dentro de SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            return;
        }


        // Crear socket
        const newSocket = io(URL_SOCKET, {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling'],
            withCredentials: true, // 👈 Importante para CORS
            query: { userId } // 👈 Enviar userId en la conexión inicial
        });

        // Eventos de conexión
        newSocket.on('connect', () => {
            setIsConnected(true);

            // Registrar usuario
            newSocket.emit('register', userId);
        });

        newSocket.on('connect_error', (error) => {
            setIsConnected(false);
        });

        newSocket.on('disconnect', (reason) => {
            setIsConnected(false);
        });

        // Escuchar usuarios online
        newSocket.on('online-users', (users) => {
            setOnlineUsers(users);
        });

        setSocket(newSocket);

        // Cleanup
        return () => {
            newSocket.close();
        };
    }, []); // Si necesitas que reaccione a cambios de userId, agrégalo aquí

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};