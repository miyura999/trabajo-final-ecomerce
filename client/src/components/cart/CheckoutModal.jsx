import React, { useState } from 'react';
import { X, MapPin, Phone, CreditCard } from 'lucide-react';
import Button from '../common/Button';

const CheckoutModal = ({ isOpen, onClose, onSubmit, loading, total }) => {
  const [formData, setFormData] = useState({
    calle: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'Colombia',
    telefono: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.calle.trim()) {
      newErrors.calle = 'La dirección es requerida';
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = 'El código postal es requerido';
    }

    if (!formData.pais.trim()) {
      newErrors.pais = 'El país es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Ingresa un teléfono válido (10 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const orderData = {
        direccionEnvio: {
          calle: formData.calle,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal,
          pais: formData.pais
        },
        telefono: formData.telefono
      };
      
      onSubmit(orderData);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        calle: '',
        ciudad: '',
        codigoPostal: '',
        pais: 'Colombia',
        telefono: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Finalizar Compra
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Completa tus datos de envío
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Dirección de Envío */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Dirección de Envío
                </h3>

                <div className="space-y-4">
                  {/* Calle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección Completa *
                    </label>
                    <input
                      type="text"
                      name="calle"
                      value={formData.calle}
                      onChange={handleChange}
                      placeholder="Ej: Carrera 45 #123-45, Apto 501"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                        errors.calle ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {errors.calle && (
                      <p className="mt-1 text-sm text-red-600">{errors.calle}</p>
                    )}
                  </div>

                  {/* Ciudad y Código Postal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        placeholder="Ej: Bogotá"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                          errors.ciudad ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      />
                      {errors.ciudad && (
                        <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        placeholder="Ej: 110111"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                          errors.codigoPostal ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      />
                      {errors.codigoPostal && (
                        <p className="mt-1 text-sm text-red-600">{errors.codigoPostal}</p>
                      )}
                    </div>
                  </div>

                  {/* País */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      País *
                    </label>
                    <select
                      name="pais"
                      value={formData.pais}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                        errors.pais ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    >
                      <option value="Colombia">Colombia</option>
                      <option value="México">México</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Chile">Chile</option>
                      <option value="Perú">Perú</option>
                    </select>
                    {errors.pais && (
                      <p className="mt-1 text-sm text-red-600">{errors.pais}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  Información de Contacto
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 3001234567"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Te contactaremos si hay algún problema con tu pedido
                  </p>
                </div>
              </div>

              {/* Resumen del Total */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total a Pagar:
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${total?.toLocaleString('es-CO')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  * Envío gratis en compras superiores a $100.000
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;