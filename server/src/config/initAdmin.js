const User = require('../models/User.model');
const Role = require('../models/Role.model');
const { hashPassword } = require('../helpers/bcrypt.helper');

const initAdmin = async () => {
  try {
    const adminRole = await Role.findOne({ name: 'admin' });
    
    if (!adminRole) {
      console.log('⚠️ Rol admin no encontrado');
      return;
    }

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ role: adminRole._id });
    
    if (existingAdmin) {
      return;
    }

    // Crear usuario admin por defecto
    const hashedPassword = await hashPassword('admin123');
    
    await User.create({
      nombre: 'Administrador',
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      role: adminRole._id,
      telefono: '0000000000',
      estado: 'activo'
    });

    console.log('✅ Usuario admin creado: admin@ecommerce.com / admin123');
  } catch (error) {
    console.error('❌ Error al crear admin:', error);
  }
};

module.exports = initAdmin;