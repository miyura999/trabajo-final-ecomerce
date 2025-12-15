const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// 👇 CONFIGURACIÓN CORRECTA DE SOCKET.IO CON CORS
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'development'
            ? 'http://localhost:5173' || true
            : 'https://trabajo-final-ecomerce.onrender.com',
        methods: ['GET', 'POST'],
        credentials: true
    },
    transports: ['websocket', 'polling'] // 👈 Importante para compatibilidad
});

app.use(cors());

app.use((req, res, next) => {
    req.io = io;
    req.userSocketMap = userSocketMap;
    next();
});

// Almacenar usuarios conectados
const userSocketMap = new Map();

io.on('connection', (socket) => {

    socket.on('register', (userId) => {
        userSocketMap.set(userId, socket.id);

        io.emit('online-users', Array.from(userSocketMap.keys()));
    });

    socket.on('send-message', ({ receiverId, senderId, text, message }) => {
        const receiverSocketId = userSocketMap.get(receiverId);


        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive-message', {
                senderId,
                receiverId,
                text,
                message,
                createdAt: new Date()
            });
        }
    });

    socket.on('disconnect', () => {

        for (let [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }

        io.emit('online-users', Array.from(userSocketMap.keys()));
    });
});

module.exports = {
    io, app, server
};