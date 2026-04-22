import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Play,
  Truck,
  Package,
  MapPin,
  Star,
  Calendar,
  Sparkles,
  Database,
  HardDrive,
  Usb,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";

const storageDevices = [
  {
    name: "USB Flash Drive",
    icon: Usb,
    capacity: "32GB - 256GB",
    price: "от 2 500 ₽",
    description: "Компактное решение для небольших коллекций",
    image:
      "https://images.unsplash.com/photo-1551818014-7c8ace9c1b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxVU0IlMjBmbGFzaCUyMGRyaXZlJTIwdGVjaG5vbG9neSUyMHByZW1pdW18ZW58MXx8fHwxNzc1OTI4MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "SSD накопитель",
    icon: Database,
    capacity: "500GB - 2TB",
    price: "от 8 900 ₽",
    description: "Быстрая передача данных, средние коллекции",
    image:
      "https://images.unsplash.com/photo-1756836857570-127b0408b676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxoYXJkJTIwZHJpdmUlMjBzdG9yYWdlJTIwU1NEJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzU5MjgyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Жесткий диск",
    icon: HardDrive,
    capacity: "1TB - 8TB",
    price: "от 12 500 ₽",
    description: "Максимальный объем для полных библиотек",
    image:
      "https://images.unsplash.com/photo-1689287428295-52e64882c4f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJkJTIwZHJpdmUlMjBzdG9yYWdlJTIwU1NEJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzU5MjgyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const libraries = [
  {
    name: "ТОП 100 IMDB",
    count: "100 фильмов",
    icon: Star,
    color: "from-amber-600/20 to-amber-600/5",
    borderColor: "border-amber-600/30",
  },
  {
    name: "ТОП 100 Кинопоиск",
    count: "100 фильмов",
    icon: Star,
    color: "from-orange-600/20 to-orange-600/5",
    borderColor: "border-orange-600/30",
  },
  {
    name: "Фильмы по годам",
    count: "1950-2026",
    icon: Calendar,
    color: "from-blue-600/20 to-blue-600/5",
    borderColor: "border-blue-600/30",
  },
  {
    name: "Новинки 2026",
    count: "50+ фильмов",
    icon: Sparkles,
    color: "from-purple-600/20 to-purple-600/5",
    borderColor: "border-purple-600/30",
  },
];

const deliveryMethods = [
  { icon: Truck, title: "Курьером", desc: "1-3 дня в пределах города" },
  { icon: Package, title: "Почтой", desc: "5-14 дней в любую точку СНГ" },
  { icon: MapPin, title: "Самовывоз", desc: "Бесплатно из пункта выдачи" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1766425597359-08c8f7585ba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXIlMjBkYXJrJTIwYXRtb3NwaGVyaWN8ZW58MXx8fHwxNzc1OTI4MjMxfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Cinema atmosphere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none">
                Ваш кинотеатр
                <br />
                на физическом
                <br />
                носителе
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl">
                Купите или арендуйте коллекцию любимых фильмов на флешке, SSD
                или жестком диске
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/catalog">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 transition-colors text-lg font-medium rounded-lg"
                  >
                    Выбрать носитель
                  </motion.button>
                </Link>
                <Link to="/libraries">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border border-white/30 hover:bg-white/10 transition-colors text-lg font-medium rounded-lg"
                  >
                    Готовые библиотеки
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <Play className="w-6 h-6 text-white/50 animate-bounce" />
        </motion.div>
      </section>

      {/* Storage Devices Section */}
      <section className="py-32 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Выберите носитель
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              От компактной флешки до объемного жесткого диска — подберем
              оптимальное решение под вашу коллекцию
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storageDevices.map((device, index) => (
              <motion.div
                key={device.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-white/10 hover:border-red-500/50 transition-all duration-300 rounded-2xl"
              >
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={device.image}
                    alt={device.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <device.icon className="w-10 h-10 text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{device.name}</h3>
                  <p className="text-gray-400 mb-4">{device.description}</p>
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-gray-500">{device.capacity}</span>
                    <span className="text-2xl font-bold text-red-500">
                      {device.price}
                    </span>
                  </div>
                  <Link to="/catalog">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-600 transition-all rounded-lg"
                    >
                      Добавить в корзину
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready Libraries Section */}
      <section className="py-32 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Готовые библиотеки
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Кураторские подборки лучших фильмов всех времен — от классики до
              новинок
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {libraries.map((library, index) => (
              <motion.div
                key={library.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`group relative overflow-hidden bg-gradient-to-br ${library.color} border ${library.borderColor} p-8 cursor-pointer rounded-2xl`}
              >
                <library.icon className="w-16 h-16 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-3xl font-bold mb-2">{library.name}</h3>
                <p className="text-gray-400 mb-6">{library.count}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span>Выберите носитель при оформлении</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/libraries">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 transition-colors text-lg font-medium rounded-lg"
              >
                Все библиотеки
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Constructor & Delivery Teaser */}
      <section className="py-32 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-red-600/20 to-purple-600/20 border border-red-500/30 p-12 text-center rounded-2xl"
            >
              <Film className="w-20 h-20 mx-auto mb-6 text-red-500" />
              <h3 className="text-3xl font-bold mb-4">
                Создайте свою коллекцию
              </h3>
              <p className="text-gray-300 mb-8">
                Выбирайте фильмы по категориям, актерам, режиссерам. Добавляйте
                в список и мы соберем все на носитель.
              </p>
              <Link to="/constructor">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-red-600 hover:bg-red-700 transition-colors text-lg font-medium rounded-lg"
                >
                  Открыть конструктор
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-zinc-800/30 border border-white/10 p-12 rounded-2xl"
            >
              <h3 className="text-3xl font-bold mb-6 text-center">
                Способы доставки
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {deliveryMethods.map((method, index) => (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <method.icon className="w-8 h-8 text-red-500" />
                    <div>
                      <h4 className="font-bold">{method.title}</h4>
                      <p className="text-sm text-gray-400">{method.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/delivery">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="text-red-500 hover:underline"
                  >
                    Подробнее о доставке →
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
