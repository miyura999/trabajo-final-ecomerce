import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Logo y descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="w-8 h-8 text-indigo-500" />
              <span className="text-2xl font-bold text-white">TechStore</span>
            </div>
            <p className="text-gray-400 mb-4">
              Tu tienda de tecnología de confianza. Los mejores productos al mejor precio.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-500 transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-indigo-500 transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-indigo-500 transition">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-indigo-500 transition">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-500 transition">
                  Sobre Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Información</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-indigo-500 transition">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-500 transition">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-500 transition">
                  Política de Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-500 transition">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-1" />
                <span>Calle 10 #20-30, Medellín, Colombia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span>info@techstore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TechStore. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition text-sm">
                Métodos de Pago
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition text-sm">
                Envíos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;