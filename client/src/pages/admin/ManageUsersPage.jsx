import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import usersService from '../../services/users.service';
import { formatDate } from '../../utils/formatters';
import { Bounce, toast, Zoom } from 'react-toastify';
import axios from 'axios';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    role: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const formatId = (idUser) => {
    const longitud = idUser.length;
    const id = idUser.slice(longitud - 4, longitud);
    return id;
  };

  // Cargar usuarios y roles
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get('/roles');
      const roles = data.data;
      setRoles(roles);
    } catch (error) {
      toast.error('Error cargando roles', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const result = await usersService.getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      toast.error('Error mostrando usuarios!', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
    setLoading(false);
  };

  // Función helper para obtener el nombre del rol desde el ID
  const getRoleName = (roleId) => {
    if (!roleId) return 'Sin rol';
    const role = roles.find(r => r._id === roleId);
    return role ? role.name : 'Sin rol';
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const roleName = getRoleName(user.role);
    const matchesRole = filterRole === '' || roleName === filterRole;
    const matchesStatus = filterStatus === '' || user.estado === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (formData.telefono && !/^\d{10}$/.test(formData.telefono)) {
      errors.telefono = 'Teléfono inválido (10 dígitos)';
    }

    if (!formData.role) {
      errors.role = 'Debes seleccionar un rol';
    }

    if (modalMode === 'create') {
      if (!formData.password) {
        errors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 8) {
        errors.password = 'Mínimo 8 caracteres';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      role: ''
    });
    setFormErrors({});
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    resetForm();
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre || '',
      email: user.email || '',
      telefono: user.telefono || '',
      password: '',
      role: user.role || '' // El role viene como ID string
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Confirmar eliminación
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Eliminar usuario
  const confirmDelete = async () => {
    const result = await usersService.deleteUser(selectedUser._id);
    if (result.success) {
      toast.success('Usuario Eliminado!', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
      fetchUsers();
    } else {
      toast.error('No se ha podido eliminar la cuenta!', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
    }
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Cambiar estado del usuario
  const toggleUserStatus = async (user) => {
    const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo';
    const result = await usersService.changeUserStatus(user._id, newStatus);

    if (result.success) {
      toast.success('Estado actualizado!', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
      fetchUsers();
    } else {
      toast.error('Ha ocurrido un error cambiando el estado!', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (modalMode === 'create') {
        // Crear usuario - asegurar que role se envíe correctamente
        console.log('📤 Datos a enviar:', formData);
        console.log('📋 Role seleccionado:', formData.role);
        
        const result = await usersService.createUser(formData);
        
        if (result.success) {
          toast.success(`Usuario ${formData.nombre} ha sido creado con éxito`, {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
          setShowModal(false);
          resetForm();
          fetchUsers();
        } else {
          toast.error(`No se pudo crear el usuario`, {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
        }
      } else {
        // Editar usuario - enviar role como ID
        const { password, ...updateData } = formData;
        const response = await axios.put(`/users/${selectedUser._id}`, updateData);
        
        if (response.data.success) {
          toast.success(`Usuario ${formData.nombre} ha sido actualizado con éxito`, {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
          setShowModal(false);
          resetForm();
          fetchUsers();
        } else {
          toast.error('No se pudo actualizar el usuario', {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error en la operación', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="container mx-auto px-6 py-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600">
                Administra los usuarios del sistema
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreate}
              className="mt-4 sm:mt-0"
            >
              <Plus className="w-5 h-5" />
              Nuevo Usuario
            </Button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                </div>
                <span className="text-3xl">👥</span>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Activos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {users.filter(u => u.estado === 'activo').length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Inactivos</p>
                  <p className="text-3xl font-bold text-red-600">
                    {users.filter(u => u.estado === 'inactivo').length}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-red-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Clientes</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {users.filter(u => getRoleName(u.role) === 'cliente').length}
                  </p>
                </div>
                <span className="text-3xl">🛒</span>
              </div>
            </Card>
          </div>

          {/* Filtros y búsqueda */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="cliente">Cliente</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </Card>

          {/* Tabla de usuarios */}
          <Card>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando usuarios...</p>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto max-h-[380px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Usuario</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Contacto</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Rol</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Estado</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Fecha Registro</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold">
                                {user.nombre?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.nombre}</p>
                              <p className="text-xs text-gray-500">{formatId(user._id)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{user.email}</span>
                            </div>
                            {user.telefono && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{user.telefono}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleName(user.role) === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}>
                            {getRoleName(user.role)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.estado === 'activo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {user.estado}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-600">
                          {formatDate(user.createdAt, 'numeric')}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleUserStatus(user)}
                              className={`p-2 rounded-lg transition ${user.estado === 'activo'
                                ? 'text-orange-600 hover:bg-orange-50'
                                : 'text-green-600 hover:bg-green-50'
                                }`}
                              title={user.estado === 'activo' ? 'Desactivar' : 'Activar'}
                            >
                              {user.estado === 'activo' ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Editar"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No se encontraron usuarios</p>
                  </div>
                )}
              </div>
            )}

            {/* Paginación */}
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <p className="text-sm text-gray-600">
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de crear/editar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Juan Pérez"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.nombre && (
              <p className="mt-1 text-sm text-red-600">{formErrors.nombre}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ejemplo@email.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="3001234567"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.telefono ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {formErrors.telefono && (
              <p className="mt-1 text-sm text-red-600">{formErrors.telefono}</p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.role ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol._id} value={rol._id}>{rol.name}</option>
              ))}
            </select>
            {formErrors.role && (
              <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
            )}
          </div>

          {/* Contraseña (solo en crear) */}
          {modalMode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              {modalMode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Usuario"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro que deseas eliminar al usuario{' '}
            <strong>{selectedUser?.nombre}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              fullWidth
              onClick={confirmDelete}
            >
              Sí, Eliminar
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsersPage;