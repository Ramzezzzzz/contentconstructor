import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { path: '/catalog', label: 'Носители' },
  { path: '/libraries', label: 'Библиотеки' },
  { path: '/constructor', label: 'Конструктор' },
  { path: '/delivery', label: 'Доставка' },
];

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Film className="w-8 h-8 text-red-500" />
          <span className="text-2xl font-bold tracking-tight">CineBox</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:text-red-500 transition-colors ${
                location.pathname === link.path ? 'text-red-500' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="flex items-center gap-2 hover:text-red-500 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Войти</span>
          </button>
          <Link to="/cart" className="relative flex items-center gap-2 hover:text-red-500 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden hover:text-red-500 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-t border-white/10"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`hover:text-red-500 transition-colors ${
                    location.pathname === link.path ? 'text-red-500' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </motion.nav>
  );
}

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-white/10 p-8 max-w-md w-full rounded-2xl"
      >
        <h3 className="text-2xl font-bold mb-6">Личный кабинет</h3>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-red-500 outline-none transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Пароль</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-red-500 outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-medium"
          >
            Войти
          </motion.button>
          <p className="text-center text-sm text-gray-400">
            Нет аккаунта? <button type="button" className="text-red-500 hover:underline">Зарегистрироваться</button>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}