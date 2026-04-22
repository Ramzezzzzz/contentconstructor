import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AnimatedPage from '../components/AnimatedPage';

const deliveryMethods = [
  { id: 'courier', icon: Truck, title: 'Курьером', price: 300, desc: '1-3 дня' },
  { id: 'post', icon: Package, title: 'Почтой', price: 200, desc: '5-14 дней' },
  { id: 'pickup', icon: MapPin, title: 'Самовывоз', price: 0, desc: 'Бесплатно' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    comment: '',
  });

  const selectedDelivery = deliveryMethods.find(m => m.id === deliveryMethod);
  const deliveryPrice = selectedDelivery?.price || 0;
  const finalTotal = totalPrice + deliveryPrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь обычно отправка данных на сервер
    alert('Заказ оформлен! Спасибо за покупку!');
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8">Оформление заказа</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-zinc-800/30 border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">Контактные данные</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Имя"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-red-500 outline-none"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-red-500 outline-none"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Телефон"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-red-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="bg-zinc-800/30 border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">Способ доставки</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {deliveryMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setDeliveryMethod(method.id)}
                        className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                          deliveryMethod === method.id
                            ? 'border-red-500 bg-red-600/10'
                            : 'border-white/10 bg-black/30 hover:border-red-500/50'
                        }`}
                      >
                        <method.icon className="w-8 h-8 text-red-500 mb-2" />
                        <h3 className="font-bold">{method.title}</h3>
                        <p className="text-sm text-gray-400">{method.desc}</p>
                        <p className="text-sm mt-1">{method.price} ₽</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-800/30 border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">Адрес доставки</h2>
                  <textarea
                    placeholder="Адрес"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-red-500 outline-none"
                    rows="3"
                    required={deliveryMethod !== 'pickup'}
                  />
                  <textarea
                    placeholder="Комментарий к заказу"
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-red-500 outline-none mt-4"
                    rows="2"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-medium text-lg"
                >
                  Подтвердить заказ
                </motion.button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-zinc-800/30 border border-white/10 rounded-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Ваш заказ</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Товары</span>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Доставка</span>
                    <span>{deliveryPrice} ₽</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-white/10">
                    <span>Итого</span>
                    <span className="text-red-500">{finalTotal.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}