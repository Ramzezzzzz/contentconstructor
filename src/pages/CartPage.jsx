import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import AnimatedPage from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/ImageWithFallback";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <AnimatedPage>
        <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4">Корзина пуста</h1>
            <p className="text-gray-400 mb-8">Добавьте товары из каталога</p>
            <Link to="/catalog">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 transition-colors rounded-lg"
              >
                Перейти в каталог
              </motion.button>
            </Link>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8">Корзина</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-4 p-4 bg-zinc-800/30 border border-white/10 rounded-xl"
                >
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-red-500 font-bold mt-1">
                      {item.price.toLocaleString()} ₽
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-red-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-red-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 ml-2 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
              <button
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Очистить корзину
              </button>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-zinc-800/30 border border-white/10 rounded-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Итого</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Товары ({items.length})
                    </span>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-white/10">
                    <span>Сумма заказа</span>
                    <span className="text-red-500">
                      {totalPrice.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
                <Link to="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-medium"
                  >
                    Оформить заказ
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
