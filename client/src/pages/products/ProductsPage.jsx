import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProductList from '../../components/products/ProductList';
import Button from '../../components/common/Button';
import { useCart } from '../../hooks/useCart';
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';
import axios from 'axios';
import api from '../../services/api.service';
import { data } from 'autoprefixer';

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Datos mock de productos
  const mockProducts = [
    {
      id: 1,
      name: 'Laptop Gaming Pro X1',
      price: 2999000,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
      description: 'Potente laptop gaming con procesador Intel i7 y tarjeta gráfica RTX 3070',
      category: 'Laptops',
      stock: 15,
      rating: 4.8
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max',
      price: 4899000,
      image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=500',
      description: 'El último smartphone de Apple con chip A17 Pro',
      category: 'Smartphones',
      stock: 8,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Mouse Inalámbrico RGB',
      price: 149000,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      description: 'Mouse gaming inalámbrico con iluminación RGB personalizable',
      category: 'Accesorios',
      stock: 50,
      rating: 4.5
    },
    {
      id: 4,
      name: 'Teclado Mecánico RGB',
      price: 299000,
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500',
      description: 'Teclado mecánico con switches Cherry MX',
      category: 'Accesorios',
      stock: 30,
      rating: 4.7
    },
    {
      id: 5,
      name: 'Monitor 27" 4K',
      price: 1299000,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
      description: 'Monitor profesional 4K con panel IPS',
      category: 'Monitores',
      stock: 12,
      rating: 4.6
    },
    {
      id: 6,
      name: 'Audífonos Bluetooth Premium',
      price: 599000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      description: 'Audífonos con cancelación de ruido activa',
      category: 'Audio',
      stock: 25,
      rating: 4.8
    },
    {
      id: 7,
      name: 'Tablet Pro 12.9"',
      price: 3499000,
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
      description: 'Tablet profesional con pantalla Retina',
      category: 'Tablets',
      stock: 10,
      rating: 4.7
    },
    {
      id: 8,
      name: 'Smartwatch Series 9',
      price: 1899000,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
      description: 'Reloj inteligente con monitoreo de salud avanzado',
      category: 'Smartwatch',
      stock: 20,
      rating: 4.6
    }
  ];

  const fetchProducts = async () => {
    const { data } = await api.get('/products')
    setProducts(data.data)
  }

  useEffect(() => {
    // Simular carga de productos
      fetchProducts()
      setFilteredProducts(products);
      setLoading(false);
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, sortBy, products]);

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Ordenar
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // newest - sin cambios
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Aquí podrías agregar una notificación toast
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Nuestros Productos
          </h1>
          <p className="text-gray-600">
            Encuentra los mejores productos de tecnología
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
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

            {/* Ordenar */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Botón de filtros móvil */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtros
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar de filtros */}
          <aside className={`
            md:w-64 md:block
            ${showFilters ? 'block' : 'hidden'}
          `}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filtros
                </h3>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Categorías
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Todas las categorías
                    </span>
                  </label>
                  {PRODUCT_CATEGORIES.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Lista de productos */}
          <main className="flex-1">
            {/* Contador de resultados */}
            <div className="mb-4">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
            </div>

            <ProductList
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              loading={loading}
            />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;