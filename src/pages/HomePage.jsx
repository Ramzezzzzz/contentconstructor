import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Film,
  Search,
  Zap,
  Shield,
  Truck,
  Plane,
  Car,
  Tent,
  Star,
  Monitor,
  HardDrive,
  Usb,
  Database,
  ArrowRight,
} from "lucide-react";

// Базовая папка сайта (автоматически берётся из конфига Vite)
const BASE_URL = import.meta.env.BASE_URL; // '/movie/'

// -- Компонент для безопасной загрузки картинок --
const ImageWithFallback = ({ src, alt, className }) => {
  const handleError = (e) => {
    e.target.onerror = null;
    e.target.style.background = "linear-gradient(135deg, #1f2937, #111827)";
    e.target.style.minHeight = "200px";
    e.target.src = "";
  };
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

// -- Данные носителей --
const devices = [
  {
    icon: Usb,
    name: "USB‑флешка",
    capacity: "32–256 ГБ",
    price: "от 2 500 ₽",
    desc: "Для 1‑5 фильмов",
  },
  {
    icon: Database,
    name: "SSD‑накопитель",
    capacity: "500 ГБ – 2 ТБ",
    price: "от 8 900 ₽",
    desc: "Для 5‑50 фильмов",
  },
  {
    icon: HardDrive,
    name: "Жёсткий диск",
    capacity: "1–8 ТБ",
    price: "от 12 500 ₽",
    desc: "Для больших коллекций",
  },
];

// -- Варианты использования (пути к картинкам теперь с BASE_URL) --
const useCases = [
  {
    icon: Plane,
    title: "В самолёте",
    desc: "Смотрите любимое кино без интернета.",
    image: `${BASE_URL}airplane.jpg`,
  },
  {
    icon: Car,
    title: "В дороге",
    desc: "Для детей на заднем сиденье — идеально.",
    image: `${BASE_URL}car.webp`,
  },
  {
    icon: Tent,
    title: "На природе",
    desc: "Вечером у костра или в палатке.",
    image: `${BASE_URL}camping.jpg`,
  },
];

// -- Поп‑культурные подборки --
const popCollections = [
  {
    emoji: "🎬",
    title: "Как у Тарантино",
    desc: "Криминальное чтиво, Бешеные псы…",
  },
  {
    emoji: "🧙",
    title: "Волшебный мир",
    desc: "Гарри Поттер, Властелин колец",
  },
  {
    emoji: "👽",
    title: "Советская фантастика",
    desc: "Сталкер, Солярис, Кин‑дза‑дза!",
  },
];

// -- Мини‑конструктор (демо) --
function MiniConstructor() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const demofilms = [
    { id: 1, title: "Интерстеллар", year: 2014, rating: 8.6 },
    { id: 2, title: "Начало", year: 2010, rating: 8.7 },
    { id: 3, title: "Побег из Шоушенка", year: 1994, rating: 9.1 },
    { id: 4, title: "Тёмный рыцарь", year: 2008, rating: 9.0 },
  ];

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length === 0) {
      setResults([]);
    } else {
      const filtered = demofilms.filter((f) =>
        f.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setResults(filtered);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Начните вводить название..."
          className="w-full py-4 pl-12 pr-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 outline-none transition-colors"
        />
      </div>
      {results.length > 0 && (
        <ul className="mt-2 bg-zinc-800 border border-white/10 rounded-xl overflow-hidden">
          {results.map((film) => (
            <li
              key={film.id}
              className="p-3 hover:bg-white/5 cursor-pointer flex items-center gap-3"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span>
                {film.title} ({film.year}) – рейтинг {film.rating}
              </span>
              <button className="ml-auto px-3 py-1 bg-red-600 rounded-lg text-sm">
                Добавить
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm text-gray-500 mt-4">
        Это демо‑версия. В полном конструкторе — тысячи фильмов.
      </p>
      <Link
        to="/constructor"
        className="inline-block mt-4 text-red-400 hover:text-red-300 font-semibold transition-colors"
      >
        Открыть конструктор
      </Link>
    </div>
  );
}

// ================== ГЛАВНАЯ СТРАНИЦА ==================
export default function HomePage() {
  return (
    <div className="bg-black text-white">
      {/* Экран 1: Приветствие */}
      <section
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${BASE_URL}hero_bg.webp)`,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          Твой офлайн‑кинотеатр
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 max-w-xl mb-10"
        >
          Коллекции фильмов на USB, SSD и жёстких дисках. Смотри где угодно, без
          интернета.
        </motion.p>
        <div className="flex gap-4">
          <Link
            to="/constructor"
            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold shadow-xl shadow-red-600/20 transition-all active:scale-95"
          >
            Создать коллекцию
          </Link>
          <Link
            to="/libraries"
            className="px-8 py-4 border border-white/30 hover:bg-white/10 rounded-xl font-semibold transition-all active:scale-95"
          >
            Готовые подборки
          </Link>
        </div>
      </section>

      {/* Экран 2: Как использовать */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Всегда с тобой
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {useCases.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-8 bg-zinc-800/30 border border-white/10 rounded-3xl overflow-hidden"
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-2xl mb-4"
                />
                <item.icon className="w-12 h-12 mx-auto mb-2 text-red-400" />
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Экран 3: Культовые подборки */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Культовые коллекции
          </h2>
          <p className="text-gray-400 mb-16 max-w-2xl mx-auto">
            Собранные со вкусом под настроение — выбирай и заказывай.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popCollections.map((col, idx) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-red-600/10 to-purple-600/10 border border-white/10 rounded-2xl p-8 cursor-pointer hover:border-red-500/50 transition-all"
              >
                <div className="text-5xl mb-4">{col.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{col.title}</h3>
                <p className="text-gray-400">{col.desc}</p>
              </motion.div>
            ))}
          </div>
          <Link
            to="/libraries"
            className="inline-block mt-12 px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all"
          >
            Все подборки
          </Link>
        </div>
      </section>

      {/* Экран 4: Встроенный мини‑конструктор */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Собери свою коллекцию
          </h2>
          <p className="text-gray-400 mb-10">
            Найди фильм и сразу добавь в корзину.
          </p>
          <MiniConstructor />
        </div>
      </section>

      {/* Экран 5: Носители + CTA */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Выберите носитель
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {devices.map((dev, idx) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-800/30 border border-white/10 rounded-3xl p-8 hover:border-red-500/50 transition-all"
              >
                <dev.icon className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <h3 className="text-xl font-bold mb-2">{dev.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{dev.desc}</p>
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {dev.price}
                </div>
                <div className="text-sm text-gray-500 mb-6">{dev.capacity}</div>
                <Link
                  to="/catalog"
                  className="block w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors"
                >
                  Выбрать
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
