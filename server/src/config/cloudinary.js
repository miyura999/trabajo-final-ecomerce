const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Función para verificar conexión
const verifyCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    console.log('✅ Cloudinary conectado exitosamente');
  } catch (error) {
    console.error('❌ Error conectando Cloudinary:', error.message);
  }
};

// IMPORTANTE: Exportar AMBAS cosas
module.exports = { 
  cloudinary, 
  verifyCloudinaryConnection 
};