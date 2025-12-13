const User = require('../models/User.model');
const Role = require('../models/Role.model');
const { hashPassword } = require('../helpers/bcrypt.helper');
const mongoose = require('mongoose');

class UserService {
  async getAllUsers() {
    return await User.find().populate('role', 'name').select('-password');
  }

  async getUserById(userId) {
    const user = await User.findById(userId).populate('role', 'name').select('-password');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  }

  async createUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await hashPassword(userData.password);
    
    // ✅ SOLUCIÓN: Verificar si userData.role es un ID válido de MongoDB
    let roleId;
    
    if (userData.role && mongoose.Types.ObjectId.isValid(userData.role)) {
      // Si es un ID válido, verificar que exista ese rol
      const roleExists = await Role.findById(userData.role);
      if (roleExists) {
        roleId = userData.role;
      } else {
        // Si no existe, asignar rol cliente por defecto
        const defaultRole = await Role.findOne({ name: 'cliente' });
        roleId = defaultRole._id;
      }
    } else {
      // Si no es un ID válido, buscar rol cliente por defecto
      const defaultRole = await Role.findOne({ name: 'cliente' });
      roleId = defaultRole._id;
    }

    const user = await User.create({
      nombre: userData.nombre,
      email: userData.email,
      password: hashedPassword,
      telefono: userData.telefono,
      role: roleId
    });

    return await User.findById(user._id).populate('role', 'name').select('-password');
  }

  async updateUser(userId, updateData) {
    // Crear objeto con solo los campos permitidos
    const allowedUpdates = {
      nombre: updateData.nombre,
      email: updateData.email,
      telefono: updateData.telefono
    };

    // Si se envía un role válido, actualizarlo
    if (updateData.role && mongoose.Types.ObjectId.isValid(updateData.role)) {
      const roleExists = await Role.findById(updateData.role);
      if (roleExists) {
        allowedUpdates.role = updateData.role;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      allowedUpdates,
      { new: true, runValidators: true }
    ).populate('role', 'name').select('-password');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  }

  async getProfile(userId) {
    return await this.getUserById(userId);
  }
}

module.exports = new UserService();