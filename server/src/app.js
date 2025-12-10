require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { cloudinary } = require('./config/cloudinary'); // ← Solo importar cloudinary
const initRoles = require('./config/initRoles');
const initAdmin = require('./config/initAdmin');
const morgan = require('morgan');

const app = express();

// Conectar a la base de datos
connectDB().then(async () => {
  await initRoles();
  await initAdmin();
  
  // Verificar Cloudinary directamente aquí
  try {
    await cloudinary.api.ping();
    console.log('✅ Cloudinary conectado exitosamente');
  } catch (error) {
    console.error('❌ Error conectando Cloudinary:', error.message);
  }
});

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de E-Commerce funcionando' });
});

// Importar rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));

// Middleware de manejo de errores (debe ir al final)
app.use(require('./middlewares/errorHandler.middleware'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});