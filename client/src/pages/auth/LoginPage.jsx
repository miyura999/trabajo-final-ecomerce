import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validationRules = {
    email: validators.compose(
      validators.required('El email es requerido'),
      validators.email('Email inválido')
    ),
    password: validators.required('La contraseña es requerida')
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    { email: '', password: '' },
    validationRules
  );

  const onSubmit = async (formValues) => {
    setLoading(true);
    setError('');

    try {
      // Simulación de login

      const validateLogin = await login(formValues.email, formValues.password);

      if(validateLogin){
        navigate('/products');
      }
      
    } catch (err) {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido de nuevo
          </h2>
          <p className="text-gray-600">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error general */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

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

            {/* Recordar y olvidé contraseña */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Recordarme
                </span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón submit */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
            >
              Iniciar Sesión
            </Button>

            {/* Usuarios de prueba */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Usuarios de prueba:
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Admin:</strong> admin@techstore.com</p>
                <p><strong>Cliente:</strong> cliente@techstore.com</p>
                <p className="text-gray-500 mt-2">Cualquier contraseña es válida</p>
              </div>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿No tienes una cuenta?
                </span>
              </div>
            </div>

            {/* Link a registro */}
            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2 px-4 border-2 border-indigo-600 rounded-lg text-indigo-600 font-semibold hover:bg-indigo-50 transition"
              >
                Crear cuenta nueva
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Al iniciar sesión, aceptas nuestros{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700">
            Términos y Condiciones
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;