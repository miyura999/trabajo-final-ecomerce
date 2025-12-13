const User = require('../models/User.model');
const Role = require('../models/Role.model');
const { hashPassword, comparePassword } = require('../helpers/bcrypt.helper');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../helpers/jwt.helper');

class AuthService {
  async register(userData) {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Buscar el rol de cliente
    let clienteRole = await Role.findOne({ name: 'cliente' });
    
    // Si no existe el rol, crearlo
    if (!clienteRole) {
      clienteRole = await Role.create({
        name: 'cliente',
        description: 'Rol de cliente del sistema'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(userData.password);

    // Crear usuario
    const user = await User.create({
      nombre: userData.nombre,
      email: userData.email,
      password: hashedPassword,
      role: clienteRole._id,
      telefono: userData.telefono,
      direccion: userData.direccion
    });

    // Generar tokens
    const token = generateToken({ id: user._id, role: clienteRole.name });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Retornar usuario sin password
    const userResponse = await User.findById(user._id).populate('role', 'name');

    return {
      user: userResponse,
      token,
      refreshToken
    };
  }

  async login(email, password) {
    // Buscar usuario con password incluido
    const user = await User.findOne({ email }).select('+password').populate('role', 'name');
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (user.estado !== 'activo') {
      throw new Error('Usuario inactivo');
    }

    // Generar tokens
    const token = generateToken({ id: user._id, role: user.role.name, name: user.nombre });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Remover password del objeto user
    user.password = undefined;

    return {
      user,
      token,
      refreshToken
    };
  }

  async refreshToken(refreshToken) {
    // Verificar el refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      throw new Error('Refresh token inválido o expirado');
    }

    // Buscar usuario
    const user = await User.findById(decoded.id).populate('role', 'name');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar que el usuario esté activo
    if (user.estado !== 'activo') {
      throw new Error('Usuario inactivo');
    }

    // Generar nuevos tokens
    const newToken = generateToken({ id: user._id, role: user.role.name });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    return {
      user: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      },
      token: newToken,
      refreshToken: newRefreshToken
    };
  }
}

module.exports = new AuthService();