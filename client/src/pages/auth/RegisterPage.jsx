import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ShoppingBag, Phone } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validationRules = {
    nombre: validators.compose(
      validators.required('El nombre es requerido'),
      validators.minLength(3, 'El nombre debe tener al menos 3 caracteres')
    ),
    email: validators.compose(
      validators.required('El email es requerido'),
      validators.email('Email inválido')
    ),
    telefono: validators.compose(
      validators.required('El teléfono es requerido'),
      validators.phone('Teléfono inválido')
    ),
    password: validators.compose(
      validators.required('La contraseña es requerida'),
      validators.minLength(8, 'La contraseña debe tener al menos 8 caracteres'),
      validators.password('La contraseña debe contener mayúsculas, minúsculas y números')
    ),
    confirmPassword: validators.compose(
      validators.required('Debes confirmar la contraseña'),
      (value, allValues) => {
        if (value !== allValues.password) {
          return 'Las contraseñas no coinciden';
        }
        return '';
      }
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
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: ''
    },
    validationRules
  );

  const onSubmit = async (formValues) => {
    setLoading(true);
    setError('');

    try {
      
      const success = await register({
        nombre: formValues.nombre,
        email: formValues.email,
        telefono: formValues.telefono,
        password: formValues.password
      });
      
      if(!success) throw new Error('Registro fallido');
      navigate(success && '/login');
    } catch (err) {
      setError('Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Crear cuenta nueva
          </h2>
          <p className="text-gray-600">
            Únete a TechStore y disfruta de nuestros productos
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error general */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Nombre completo */}
            <Input
              label="Nombre Completo"
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              placeholder="Juan Pérez"
              required
              icon={User}
            />

            {/* Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder="tu@email.com"
              required
              icon={Mail}
            />

            {/* Teléfono */}
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
              required
              icon={Phone}
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                placeholder="••••••••"
                required
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirmar Contraseña"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                placeholder="••••••••"
                required
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Requisitos de contraseña */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                La contraseña debe contener:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className={values.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>●</span>
                  Mínimo 8 caracteres
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[A-Z]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}>●</span>
                  Al menos una mayúscula
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[a-z]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}>●</span>
                  Al menos una minúscula
                </li>
                <li className="flex items-center gap-2">
                  <span className={/\d/.test(values.password) ? 'text-green-600' : 'text-gray-400'}>●</span>
                  Al menos un número
                </li>
              </ul>
            </div>

            {/* Botón submit */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
            >
              Crear Cuenta
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿Ya tienes una cuenta?
                </span>
              </div>
            </div>

            {/* Link a login */}
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border-2 border-indigo-600 rounded-lg text-indigo-600 font-semibold hover:bg-indigo-50 transition"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;