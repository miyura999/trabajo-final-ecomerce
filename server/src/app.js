require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const { verifyCloudinaryConnection } = require('./config/cloudinary');
const initRoles = require('./config/initRoles');
const initAdmin = require('./config/initAdmin');
const morgan = require('morgan');
const router = require('./routes/router')
const { app, server } = require('./config/socket')

// Conectar a la base de datos
connectDB().then(async () => {
  await initRoles();
  await initAdmin();
  await verifyCloudinaryConnection()
});

// Middlewares globales
app.use(express.json());
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));
app.use(router)

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});