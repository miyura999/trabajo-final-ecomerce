import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ProductForm from '../../components/products/ProductForm';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api.service';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [categories, setCategories] = useState([]);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.categoria) params.categoria = filters.categoria;
      if (filters.estado) params.estado = filters.estado;

      const response = await api.get('/products', { params });
      setProducts(response.data.data);
      
      // Extraer categorías únicas
      const uniqueCategories = [];
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros cuando cambien los valores de búsqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts({
        search: searchTerm,
        categoria: filterCategory
      });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterCategory]);

  const filteredProducts = products;

  const handleCreate = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${selectedProduct._id}`);
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error al eliminar el producto');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        const response = await axios.post('/products', formData);
        setProducts([...products, response.data]);
      } else {
        const response = await axios.put(`/products/${selectedProduct._id}`, formData);
        setProducts(products.map(p =>
          p._id === selectedProduct._id ? response.data : p
        ));
      }
      setShowModal(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error al guardar el producto');
    }
  };

  const getStockStatus = (stock) => {
    if (stock > 20) return { class: 'bg-green-100 text-green-800', label: 'Alto' };
    if (stock > 10) return { class: 'bg-yellow-100 text-yellow-800', label: 'Medio' };
    return { class: 'bg-red-100 text-red-800', label: 'Bajo' };
  };

  const getEstadoLabel = (estado) => {
    const estados = {
      'disponible': { label: 'Disponible', class: 'bg-green-100 text-green-800' },
      'agotado': { label: 'Agotado', class: 'bg-red-100 text-red-800' },
      'descontinuado': { label: 'Descontinuado', class: 'bg-gray-100 text-gray-800' }
    };
    return estados[estado] || { label: estado, class: 'bg-blue-100 text-blue-800' };
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
                Gestión de Productos
              </h1>
              <p className="text-gray-600">
                Administra el catálogo de productos
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreate}
              className="mt-4 sm:mt-0"
            >
              <Plus className="w-5 h-5" />
              Nuevo Producto
            </Button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Productos</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : products.length}
                  </p>
                </div>
                <span className="text-3xl">📦</span>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Disponibles</p>
                  <p className="text-3xl font-bold text-green-600">
                    {loading ? '...' : products.filter(p => p.estado === 'disponible').length}
                  </p>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Stock Bajo</p>
                  <p className="text-3xl font-bold text-red-600">
                    {loading ? '...' : products.filter(p => p.stock <= 10).length}
                  </p>
                </div>
                <span className="text-3xl">⚠️</span>
              </div>
            </Card>
          </div>

          {/* Barra de búsqueda y filtros */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Tabla de productos */}
          <Card>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => fetchProducts()} className="mt-4">
                  Reintentar
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Producto</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Categoría</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Precio</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Estado</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      const estadoInfo = getEstadoLabel(product.estado);
                      
                      return (
                        <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.imagen || 'https://via.placeholder.com/150'}
                                alt={product.nombre}
                                className="w-12 h-12 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/150';
                                }}
                              />
                              <div>
                                <p className="font-semibold text-gray-900">{product.nombre}</p>
                                <p className="text-sm text-gray-500">ID: {product._id.slice(-6)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                              {product.categoria}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            {formatPrice(product.precio)}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.class}`}>
                              {product.stock} unidades
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${estadoInfo.class}`}>
                              {estadoInfo.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Editar"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(product)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Eliminar"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No se encontraron productos</p>
                  </div>
                )}
              </div>
            )}

            {/* Paginación */}
            {!loading && !error && (
              <div className="flex items-center justify-between pt-6 border-t">
                <p className="text-sm text-gray-600">
                  Mostrando {filteredProducts.length} de {products.length} productos
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button variant="outline" size="sm">Siguiente</Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Footer />
      </div>

      {/* Modal de crear/editar producto */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
        size="lg"
      >
        <ProductForm
          initialData={selectedProduct}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Producto"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro que deseas eliminar el producto{' '}
            <strong>{selectedProduct?.nombre}</strong>? Esta acción no se puede deshacer.
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

export default ManageProductsPage;