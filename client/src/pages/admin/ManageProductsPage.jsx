import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ProductForm from '../../components/products/ProductForm';
import { formatPrice } from '../../utils/formatters';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Laptop Gaming Pro X1',
      price: 2999000,
      category: 'Laptops',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200',
      status: 'Activo'
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max',
      price: 4899000,
      category: 'Smartphones',
      stock: 8,
      image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=200',
      status: 'Activo'
    },
    {
      id: 3,
      name: 'Mouse Inalámbrico RGB',
      price: 149000,
      category: 'Accesorios',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200',
      status: 'Activo'
    },
    {
      id: 4,
      name: 'Teclado Mecánico RGB',
      price: 299000,
      category: 'Accesorios',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=200',
      status: 'Activo'
    },
    {
      id: 5,
      name: 'Monitor 27" 4K',
      price: 1299000,
      category: 'Monitores',
      stock: 12,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200',
      status: 'Activo'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleSubmit = (formData) => {
    if (modalMode === 'create') {
      const newProduct = {
        ...formData,
        id: Date.now(),
        status: 'Activo'
      };
      setProducts([...products, newProduct]);
    } else {
      setProducts(products.map(p =>
        p.id === selectedProduct.id ? { ...p, ...formData } : p
      ));
    }
    setShowModal(false);
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
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Todas las categorías</option>
                <option value="laptops">Laptops</option>
                <option value="smartphones">Smartphones</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
          </Card>

          {/* Tabla de productos */}
          <Card>
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
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${product.stock > 20 ? 'bg-green-100 text-green-800' : 
                            product.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}
                        `}>
                          {product.stock} unidades
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {product.status}
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
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No se encontraron productos</p>
                </div>
              )}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between pt-6 border-t">
              <p className="text-sm text-gray-600">
                Mostrando {filteredProducts.length} de {products.length} productos
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Anterior</Button>
                <Button variant="outline" size="sm">Siguiente</Button>
              </div>
            </div>
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
            <strong>{selectedProduct?.name}</strong>? Esta acción no se puede deshacer.
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