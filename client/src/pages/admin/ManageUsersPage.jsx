import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import usersService from '../../services/users.service';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';
import { formatDate } from '../../utils/formatters';
import { toast, Zoom } from 'react-toastify';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Validaciones del formulario
  const validationRules = {
    nombre: validators.required('El nombre es requerido'),
    email: validators.compose(
      validators.required('El email es requerido'),
      validators.email('Email inválido')
    ),
    telefono: validators.phone('Teléfono inválido'),
    password: modalMode === 'create'
      ? validators.compose(
        validators.required('La contraseña es requerida'),
        validators.minLength(8, 'Mínimo 8 caracteres')
      )
      : () => ''
  };

const formatId = (idUser) => {
  const longitud = idUser.length
  const id = idUser.slice(longitud - 4, longitud)
  return id
}

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue
  } = useForm(
    {
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      role: '69319e7865f7b31067b6020c' // ID de rol cliente por defecto
    },
    validationRules
  );

  // Cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await usersService.getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === '' || user.role?.name === filterRole;
    const matchesStatus = filterStatus === '' || user.estado === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

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
    setFieldValue('nombre', user.nombre);
    setFieldValue('email', user.email);
    setFieldValue('telefono', user.telefono || '');
    setFieldValue('role', user.role?._id || '');
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
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
      });
      fetchUsers();
    } else {
      toast.error('No se ha podido eliminar la cuenta!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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
      fetchUsers();
    } else {
      toast.error('Ha ocurido un error cambiando el estado!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
      });
    }
  };

  // Enviar formulario
  const onSubmit = async (formData) => {
    setLoading(true);

    let result;
    if (modalMode === 'create') {
      result = await usersService.createUser(formData);
    } else {
      const { password, ...updateData } = formData;
      result = await usersService.updateUser(selectedUser._id, updateData);
    }

    if (result.success) {
      alert(result.message);
      setShowModal(false);
      resetForm();
      fetchUsers();
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="container mx-auto px-6 py-8">
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
                    {users.filter(u => u.role?.name === 'cliente').length}
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
              <div className="overflow-x-auto">
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
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold">
                                {user.nombre?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.nombre}</p>
                              <p className="text-sm text-gray-500">{formatId(user._id)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{user.email}</span>
                            </div>
                            {user.telefono && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{user.telefono}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role?.name === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}>
                            {user.role?.name || 'Sin rol'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.estado === 'activo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {user.estado}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
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

        <Footer />
      </div>

      {/* Modal de crear/editar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre Completo"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.nombre}
            touched={touched.nombre}
            placeholder="Ej: Juan Pérez"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            placeholder="ejemplo@email.com"
            required
            icon={Mail}
          />

          <Input
            label="Teléfono"
            name="telefono"
            type="tel"
            value={values.telefono}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.telefono}
            touched={touched.telefono}
            placeholder="3001234567"
            icon={Phone}
          />

          {modalMode === 'create' && (
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              placeholder="••••••••"
              required
            />
          )}

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