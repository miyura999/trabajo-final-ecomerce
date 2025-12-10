const User = require('../models/User.model');
const Role = require('../models/Role.model');
const { hashPassword } = require('../helpers/bcrypt.helper');

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
    
    let role = await Role.findOne({ name: userData.role || 'cliente' });
    
    if (!role) {
      role = await Role.findOne({ name: 'cliente' });
    }

    const user = await User.create({
      ...userData,
      password: hashedPassword,
      role: role._id
    });

    return await User.findById(user._id).populate('role', 'name').select('-password');
  }

  async updateUser(userId, updateData) {
    // No permitir actualizar password directamente
    delete updateData.password;
    delete updateData.role;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
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