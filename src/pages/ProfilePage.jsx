import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Film,
  Package,
  Settings,
  LogOut,
  Star,
  HardDrive,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AnimatedPage from "../components/AnimatedPage";

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("collection");
  const [collection, setCollection] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "/movie/api";

  useEffect(() => {
    if (!user || !token) return;
    const loadData = async () => {
      try {
        // Загружаем коллекцию
        const colRes = await fetch(`${API_BASE}/collection.php`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const colData = await colRes.json();
        setCollection(Array.isArray(colData) ? colData : []);

        // Загружаем заказы (пока заглушка, если API нет)
        // Можно оставить пустой массив
        setOrders([]);
      } catch (err) {
        console.error("Ошибка загрузки данных профиля:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, token]);

  if (!user) {
    return (
      <AnimatedPage>
        <div className="pt-24 text-center text-gray-400">
          Пожалуйста, войдите.
        </div>
      </AnimatedPage>
    );
  }

  const tabs = [
    { id: "collection", label: "Моя коллекция", icon: Film },
    { id: "orders", label: "Заказы", icon: Package },
    { id: "settings", label: "Настройки", icon: Settings },
  ];

  const totalFilms = collection.length;
  const totalSizeGB = (totalFilms * 2.5).toFixed(1);
  const totalDurationHours = (totalFilms * 2).toFixed(1);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Профиль header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
          >
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name || user.email}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </motion.div>

          {/* Вкладки */}
          <div className="flex border-b border-white/10 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Контент вкладок */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Загрузка...</div>
          ) : (
            <>
              {activeTab === "collection" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-zinc-800/30 border border-white/10 rounded-xl p-4">
                      <Film className="w-8 h-8 text-red-500 mb-2" />
                      <div className="text-2xl font-bold">{totalFilms}</div>
                      <div className="text-sm text-gray-400">
                        фильмов в коллекции
                      </div>
                    </div>
                    <div className="bg-zinc-800/30 border border-white/10 rounded-xl p-4">
                      <HardDrive className="w-8 h-8 text-red-500 mb-2" />
                      <div className="text-2xl font-bold">{totalSizeGB} ГБ</div>
                      <div className="text-sm text-gray-400">
                        примерный объём
                      </div>
                    </div>
                    <div className="bg-zinc-800/30 border border-white/10 rounded-xl p-4">
                      <Clock className="w-8 h-8 text-red-500 mb-2" />
                      <div className="text-2xl font-bold">
                        {totalDurationHours} ч
                      </div>
                      <div className="text-sm text-gray-400">общее время</div>
                    </div>
                  </div>

                  {collection.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Film className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Ваша коллекция пуста.</p>
                      <p className="text-sm">
                        Добавьте фильмы через{" "}
                        <a
                          href="/constructor"
                          className="text-red-500 underline"
                        >
                          конструктор
                        </a>
                        .
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {collection.map((item) => (
                        <div
                          key={item.kinopoisk_id}
                          className="bg-zinc-800/50 border border-white/10 rounded-xl overflow-hidden"
                        >
                          <img
                            src={
                              item.poster_url ||
                              "https://via.placeholder.com/300x450?text=Нет+постера"
                            }
                            alt={item.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x450?text=Нет+постера";
                            }}
                          />
                          <div className="p-3">
                            <h3 className="text-sm font-medium truncate">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {item.rating || "—"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>У вас пока нет заказов.</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-zinc-800/30 border border-white/10 rounded-xl p-4 flex justify-between"
                      >
                        <div>
                          <span className="font-medium">Заказ №{order.id}</span>
                          <div className="text-sm text-gray-400">
                            {order.device_id} ({order.capacity}) • {order.price}{" "}
                            ₽
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">
                          {order.status}
                        </span>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-800/30 border border-white/10 rounded-xl p-6 max-w-md"
                >
                  <h3 className="text-xl font-bold mb-4">Личные данные</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Имя
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-4 py-2 bg-black border border-white/20 rounded-xl text-white"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2 bg-black border border-white/20 rounded-xl text-white"
                        disabled
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Редактирование профиля появится позже.
                    </p>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
