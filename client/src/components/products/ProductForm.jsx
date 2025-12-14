import React, { useState } from 'react';
import { Package, DollarSign, FileText, Grid3x3, Upload, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductForm({ onSubmit, initialData, mode }) {

  const CLOUD_NAME = "dzkjoguoc"
  const PRESET_NAME = "ml_default"
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    nombre: initialData?.nombre || '',
    precio: initialData?.precio || '',
    descripcion: initialData?.descripcion || '',
    categoria: initialData?.categoria || '',
    stock: initialData?.stock || ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        return !value ? 'El nombre es requerido' : '';
      case 'precio':
        if (!value) return 'El precio es requerido';
        if (parseFloat(value) <= 0) return 'El precio debe ser mayor a 0';
        return '';
      case 'descripcion':
        return !value ? 'La descripción es requerida' : '';
      case 'categoria':
        return !value ? 'La categoría es requerida' : '';
      case 'stock':
        if (value === '') return 'El stock es requerido';
        if (parseFloat(value) < 0) return 'El stock debe ser mayor o igual a 0';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, imagen: 'Por favor selecciona un archivo de imagen válido' }));
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imagen: 'La imagen no debe superar los 5MB' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, imagen: '' }));

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setErrors(prev => ({ ...prev, imagen: '' }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(values).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) newErrors[key] = error;
    });

    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        let imageUrl = initialData?.imagen || '';

        // Subir imagen a Cloudinary si existe una nueva imagen
        if (imageFile) {
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('upload_preset', PRESET_NAME);

          const resImg = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
          });

          if (!resImg.ok) {
            throw new Error('Error al subir la imagen a Cloudinary');
          }

          const dataImg = await resImg.json();
          imageUrl = dataImg.secure_url;
        }

        // Crear objeto del producto con la URL de la imagen
        const productData = {
          nombre: values.nombre,
          precio: parseFloat(values.precio),
          descripcion: values.descripcion,
          categoria: values.categoria,
          stock: parseInt(values.stock),
          imagen: imageUrl // URL de Cloudinary
        };

        // Verificar si es modo crear o editar
        if (mode === 'crear') {
          await axios.post('/products', productData);
          toast.success('Producto creado con éxito', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colored",
          });
        } else {
          // Modo editar
          await axios.put(`/products/${initialData._id}`, productData);
          toast.success('Producto actualizado con éxito', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colored",
          });
        }

        onSubmit();

        // Resetear formulario solo en modo crear
        if (mode === 'crear') {
          setValues({
            nombre: '',
            precio: '',
            descripcion: '',
            categoria: '',
            stock: ''
          });
          setImageFile(null);
          setImagePreview(null);
          setTouched({});
          setErrors({});
        }
      } catch (error) {
        console.error('Error al procesar producto:', error);
        toast.error(mode === 'crear' ? 'Error creando producto' : 'Error actualizando producto', {
          position: "bottom-right",
          autoClose: 2000,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };
  return (
    <>
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Producto <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`
              w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all
              ${touched.nombre && errors.nombre
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }
            `}
          />
        </div>
        {touched.nombre && errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
          Precio <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            name="precio"
            value={values.precio}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0.00"
            className={`
              w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all
              ${touched.precio && errors.precio
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }
            `}
          />
        </div>
        {touched.precio && errors.precio && (
          <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
        )}
      </div>

      {/* Categoría */}
      <div className="mb-4">
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Grid3x3 className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name="categoria"
            value={values.categoria}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`
              w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all
              ${touched.categoria && errors.categoria
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
        {touched.categoria && errors.categoria && (
          <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
        )}
      </div>

      {/* Stock */}
      <div className="mb-4">
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
          Stock <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="stock"
            value={values.stock}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0"
            className={`
              w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all
              ${touched.stock && errors.stock
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }
            `}
          />
        </div>
        {touched.stock && errors.stock && (
          <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            name="descripcion"
            value={values.descripcion}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            placeholder="Describe el producto..."
            className={`
              w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none
              ${touched.descripcion && errors.descripcion
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }
            `}
          />
        </div>
        {touched.descripcion && errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
        )}
      </div>

      {!initialData && (
        <div className="mb-4">
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
            Imagen del Producto
          </label>

          {!imagePreview ? (
            <div className="relative">
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="imagen"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Haz clic para subir una imagen</span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 5MB</span>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">{imageFile?.name}</span>
                <span className="ml-2 text-gray-500">
                  ({(imageFile?.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            </div>
          )}

          {errors.imagen && (
            <p className="mt-1 text-sm text-red-600">{errors.imagen}</p>
          )}
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`
            w-full px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
            bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {loading ? 'Guardando...' : mode === 'crear' ? 'Crear Producto' : 'Editar producto'}
        </button>
      </div>
    </>

  );
}