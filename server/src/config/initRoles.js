const Role = require('../models/Role.model');

const initRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count > 0) return;

    await Promise.all([
      Role.create({
        name: 'admin',
        description: 'Administrador del sistema'
      }),
      Role.create({
        name: 'cliente',
        description: 'Cliente del e-commerce'
      })
    ]);

    console.log('✅ Roles inicializados');
  } catch (error) {
    console.error('❌ Error al inicializar roles:', error);
  }
};

module.exports = initRoles;