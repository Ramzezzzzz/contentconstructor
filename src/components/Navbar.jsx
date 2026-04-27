import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Film, User, ShoppingCart, Menu, X, Lock, Mail } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { path: "/catalog", label: "Носители" },
  { path: "/libraries", label: "Библиотеки" },
  { path: "/constructor", label: "Конструктор" },
  { path: "/delivery", label: "Доставка" },
];

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [authError, setAuthError] = useState("");
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, login, register, logout } = useAuth();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (authMode === "login") {
        await login(authForm.email, authForm.password);
      } else {
        await register(authForm.email, authForm.password, authForm.name);
      }
      setIsAuthOpen(false);
      setAuthForm({ email: "", password: "", name: "" });
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthOpen(false);
  };

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
                location.pathname === link.path ? "text-red-500" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-gray-300">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Войти</span>
            </button>
          )}

          <Link
            to="/cart"
            className="relative flex items-center gap-2 hover:text-red-500 transition-colors"
          >
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
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
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
                    location.pathname === link.path ? "text-red-500" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модалка авторизации */}
      <AnimatePresence>
        {isAuthOpen && !user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsAuthOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-zinc-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg relative"
            >
              {/* Крестик закрытия */}
              <button
                onClick={() => setIsAuthOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-5 sm:p-8 max-h-[85vh] overflow-y-auto">
                {/* Вкладки */}
                <div className="flex mb-8 bg-zinc-800/50 rounded-xl p-1">
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError("");
                    }}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                      authMode === "login"
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Вход
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setAuthError("");
                    }}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                      authMode === "register"
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Регистрация
                  </button>
                </div>

                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-xl text-sm text-red-300 flex items-center gap-2"
                  >
                    <span className="text-lg">⚠️</span>
                    {authError}
                  </motion.div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAuthSubmit(e);
                  }}
                  className="space-y-5"
                >
                  {authMode === "register" && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">
                        Имя
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={authForm.name}
                          onChange={(e) =>
                            setAuthForm({ ...authForm, name: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-black border border-white/20 rounded-xl focus:border-red-500 outline-none transition-colors text-white placeholder-gray-500"
                          placeholder="Иван Петров"
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={(e) =>
                          setAuthForm({ ...authForm, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-black border border-white/20 rounded-xl focus:border-red-500 outline-none transition-colors text-white placeholder-gray-500"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">
                      Пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="password"
                        value={authForm.password}
                        onChange={(e) =>
                          setAuthForm({ ...authForm, password: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-black border border-white/20 rounded-xl focus:border-red-500 outline-none transition-colors text-white placeholder-gray-500"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {authMode === "login" ? "Войти" : "Зарегистрироваться"}
                  </button>
                </form>

                {/* Разделитель */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900 px-3 text-gray-500">
                      или продолжить через
                    </span>
                  </div>
                </div>

                {/* Социальные кнопки БЕЗ SVG */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled
                    className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 cursor-not-allowed transition-all hover:bg-white/10 disabled:opacity-60"
                    title="Скоро появится"
                  >
                    <span className="text-lg font-bold text-red-400">G+</span>
                    Google
                  </button>
                  <button
                    disabled
                    className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 cursor-not-allowed transition-all hover:bg-white/10 disabled:opacity-60"
                    title="Скоро появится"
                  >
                    <span className="text-lg font-bold text-blue-400">✈️</span>
                    Telegram
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
