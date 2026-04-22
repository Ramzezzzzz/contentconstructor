import { useState } from "react";
import { motion } from "framer-motion";
import { Usb, Database, HardDrive } from "lucide-react";
import { useCart } from "../context/CartContext";
import { storageDevices } from "../data/products";
import { ImageWithFallback } from "../components/ImageWithFallback";
import AnimatedPage from "../components/AnimatedPage";

const iconMap = { Usb, Database, HardDrive };

export default function CatalogPage() {
  const [selectedCapacities, setSelectedCapacities] = useState({});
  const { addItem } = useCart();

  const handleCapacityChange = (deviceId, capacityIndex) => {
    setSelectedCapacities((prev) => ({ ...prev, [deviceId]: capacityIndex }));
  };

  const handleAddToCart = (device) => {
    const capacityIndex = selectedCapacities[device.id] || 0;
    const capacity = device.capacity[capacityIndex];
    const price = device.price[capacityIndex];
    addItem({
      id: `${device.id}-${capacity}`,
      name: `${device.name} ${capacity}`,
      price: price,
      image: device.image,
    });
  };

  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-8 text-center"
          >
            Каталог носителей
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto text-center mb-16"
          >
            Выберите идеальный носитель для вашей коллекции фильмов
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storageDevices.map((device, index) => {
              const Icon = iconMap[device.icon];
              const capacityIndex = selectedCapacities[device.id] || 0;
              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden">
                    <ImageWithFallback
                      src={device.image}
                      alt={device.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <Icon className="w-10 h-10 text-red-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{device.name}</h3>
                    <p className="text-gray-400 mb-4">{device.description}</p>
                    <div className="mb-4">
                      <label className="block text-sm mb-2 text-gray-400">
                        Объем
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {device.capacity.map((cap, i) => (
                          <button
                            key={cap}
                            onClick={() => handleCapacityChange(device.id, i)}
                            className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                              capacityIndex === i
                                ? "bg-red-600 border-red-600 text-white"
                                : "bg-black border-white/20 hover:border-red-500"
                            }`}
                          >
                            {cap}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between mb-6">
                      <span className="text-gray-500">
                        {device.capacity[capacityIndex]}
                      </span>
                      <span className="text-2xl font-bold text-red-500">
                        {device.price[capacityIndex].toLocaleString()} ₽
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(device)}
                      className="w-full py-3 bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-600 transition-all rounded-lg"
                    >
                      Добавить в корзину
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
