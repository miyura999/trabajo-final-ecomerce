import React from 'react';
import { Package, DollarSign, FileText, Grid3x3, ImageIcon } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';

const ProductForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const validationRules = {
    name: validators.required('El nombre es requerido'),
    price: validators.compose(
      validators.required('El precio es requerido'),
      validators.min(0, 'El precio debe ser mayor a 0')
    ),
    description: validators.required('La descripción es requerida'),
    category: validators.required('La categoría es requerida'),
    stock: validators.compose(
      validators.required('El stock es requerido'),
      validators.min(0, 'El stock debe ser mayor o igual a 0')
    )
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    {
      name: initialData?.name || '',
      price: initialData?.price || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      stock: initialData?.stock || '',
      image: initialData?.image || ''
    },
    validationRules
  );

  const categories = [
    'Laptops',
    'Smartphones',
    'Tablets',
    'Accesorios',
    'Gaming',
    'Audio',
    'Cámaras',
    'Smartwatch'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nombre del producto */}
      <Input
        label="Nombre del Producto"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        touched={touched.name}
        placeholder="Ej: Laptop Gaming Pro"
        required
        icon={Package}
      />

      {/* Precio */}
      <Input
        label="Precio"
        name="price"
        type="number"
        value={values.price}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.price}
        touched={touched.price}
        placeholder="0.00"
        required
        icon={DollarSign}
      />

      {/* Categoría */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Grid3x3 className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`
              w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all
              ${touched.category && errors.category
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }
            `}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {touched.category && errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Stock */}
      <Input
        label="Stock"
        name="stock"
        type="number"
        value={values.stock}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.stock}
        touched={touched.stock}
        placeholder="0"
        required
      />

      {/* Descripción */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            placeholder="Describe el producto..."
            className={`
              w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none
              ${touched.description && errors.description
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }
            `}
          />
        </div>
        {touched.description && errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* URL de imagen */}
      <Input
        label="URL de Imagen"
        name="image"
        value={values.image}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="https://mkgabinet.com/wp-content/uploads/2022/07/caracteristicas-beneficios-producto-mejorar-ventas.jpg"
        icon={ImageIcon}
      />

      {/* Vista previa de imagen */}
      {values.image && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
          <img
            src={values.image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          {initialData?.id ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} fullWidth>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
