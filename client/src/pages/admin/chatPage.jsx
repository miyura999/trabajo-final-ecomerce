import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '../../hooks/useChat';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import ImageUpload from '../../components/common/ImageUpload';
import Header from '../../components/layout/Header';

export const useMessages = (selectedUserId) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { socket } = useSocket();

    const { userId } = useAuth();
    const myUserId = userId;

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/messages/users`);
            setUsers(response.data.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMessages = useCallback(async (userId) => {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await axios.get(`/messages/${userId}`);
            const data = response.data.data;
            setMessages(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (receiverId, text, imageUrl = null) => {
        if ((!text || !text.trim()) && !imageUrl) return;
        if (!myUserId) return;

        try {
            const response = await axios.post(`/messages/${receiverId}`, {
                text: text || '',
                image: imageUrl
            });

            const data = response.data.data;

            const newMessage = {
                _id: data._id,
                senderId: myUserId,
                receiverId,
                text: text || '',
                image: imageUrl,
                createdAt: data.createdAt || new Date()
            };

            setMessages(prev => [...prev, newMessage]);

        } catch (err) {
            setError(err.message);
            console.error('Error sending message:', err);
        }
    }, [myUserId]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleReceiveMessage = (newMessage) => {

            if (newMessage.senderId === selectedUserId) {
                setMessages(prev => [...prev, newMessage]);
            }
        };

        socket.on('receive-message', handleReceiveMessage);

        return () => {
            socket.off('receive-message', handleReceiveMessage);
        };
    }, [socket, selectedUserId]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        if (selectedUserId) {
            fetchMessages(selectedUserId);
        } else {
            setMessages([]);
        }
    }, [selectedUserId, fetchMessages]);

    return {
        messages,
        myUserId,
        users,
        loading,
        error,
        sendMessage,
        fetchMessages
    };
};

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [imageKey, setImageKey] = useState(0);
    const messagesEndRef = useRef(null);

    const { myUserId, messages, users, loading, sendMessage } = useMessages(selectedUser?._id);
    const { onlineUsers } = useSocket();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if ((!messageInput.trim() && !imageUrl) || !selectedUser) return;

        sendMessage(selectedUser._id, messageInput, imageUrl);

        setMessageInput('');
        setImageUrl(null);
        setImageKey(prev => prev + 1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const isUserOnline = (userId) => {
        return onlineUsers.some(id => id.toString() === userId.toString());
    };

    const formatTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar - Lista de usuarios */}
            <div className="w-80 bg-white shadow-lg flex flex-col">
                <div className="p-2 bg-indigo-600">
                    <h2 className="text-2xl font-bold text-center text-white tracking-tight">Mensajes</h2>
                    <p className="text-indigo-100 text-sm mt-1">{users.length} contactos</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading && users.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="text-gray-500 mt-4">Cargando contactos...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="font-medium">No hay usuarios disponibles</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${selectedUser?._id === user._id
                                        ? 'bg-indigo-50 border-l-4 border-l-indigo-600'
                                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                                            {user.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        {isUserOnline(user._id) && (
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{user.nombre}</h3>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Área principal con Header y Chat */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {selectedUser ? (
                        <>


                            {/* Mensajes */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                                {messages.length === 0 ? (
                                    <div className="text-center mt-16">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
                                            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 text-lg font-medium">No hay mensajes aún</p>
                                        <p className="text-gray-500 text-sm mt-1">¡Inicia la conversación!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMyMessage = msg.senderId?.toString() === myUserId?.toString();

                                        return (
                                            <div
                                                key={msg._id || index}
                                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${isMyMessage
                                                            ? 'bg-indigo-600 text-white rounded-br-sm'
                                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                                                        }`}
                                                >
                                                    {msg.image && (
                                                        <img
                                                            src={msg.image}
                                                            alt="Imagen enviada"
                                                            className="rounded-xl mb-2 max-w-full cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                                                            onClick={() => window.open(msg.image, '_blank')}
                                                        />
                                                    )}

                                                    {msg.text && (
                                                        <p className="break-words leading-relaxed">{msg.text}</p>
                                                    )}

                                                    <p className={`text-xs mt-1.5 ${isMyMessage ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input de mensaje */}
                            <div className="bg-white border-t border-gray-200 p-5 shadow-lg">
                                <div className="flex flex-col gap-3">
                                    <ImageUpload
                                        key={imageKey}
                                        onImageSelect={setImageUrl}
                                        onUploadComplete={setImageUrl}
                                        disabled={false}
                                    />

                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Escribe un mensaje..."
                                            className="flex-1 px-4 py-3 bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim() && !imageUrl}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md active:scale-95 disabled:active:scale-100"
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-slate-50">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-6 shadow-lg">
                                    <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-xl font-semibold text-gray-800 mb-2">Selecciona un usuario</p>
                                <p className="text-gray-500">Elige un contacto para comenzar a chatear</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;