import { useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Plane,
  Car,
  Tent,
  ArrowRight,
  Film,
  HardDrive,
  Usb,
  Database,
  Shield,
  Zap,
  Truck,
  Play,
  Pause,
  RefreshCw,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext"; // авторизация

const BASE_URL = import.meta.env.BASE_URL; // '/movie/'

// Варианты использования
const useCases = [
  {
    icon: Plane,
    title: "В самолёте",
    desc: "Смотрите без интернета в полёте.",
    image: `${BASE_URL}images/airplane.jpg`,
  },
  {
    icon: Car,
    title: "В дороге",
    desc: "Займите детей в автомобиле.",
    image: `${BASE_URL}images/car.webp`,
  },
  {
    icon: Tent,
    title: "На природе",
    desc: "Кинотеатр у костра.",
    image: `${BASE_URL}images/camping.jpg`,
  },
];

/* ================== Экран 1: Герой с персонализацией ================== */
function Hero() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
      <motion.div
        style={{ y, backgroundImage: `url(${BASE_URL}images/hero_bg.webp)` }}
        className="absolute inset-0 bg-cover bg-center opacity-40"
      />
      <div className="relative z-10 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          {user
            ? `С возвращением, ${user.name || "друг"}!`
            : "Твой офлайн‑кинотеатр"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12"
        >
          {user
            ? "Ваша коллекция ждёт. Продолжите наполнять её или выберите готовую подборку."
            : "Коллекции фильмов на USB, SSD и жёстких дисках. Смотри где угодно, без интернета."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {user ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/constructor"
                className="px-10 py-5 bg-red-600 hover:bg-red-700 rounded-2xl text-xl font-semibold shadow-2xl shadow-red-600/30 transition-all active:scale-95"
              >
                Продолжить сборку
              </Link>
              <Link
                to="/profile"
                className="px-10 py-5 border border-white/30 hover:bg-white/10 rounded-2xl text-xl font-semibold transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                Личный кабинет
              </Link>
            </div>
          ) : (
            <Link
              to="/constructor"
              className="inline-flex items-center gap-2 px-10 py-5 bg-red-600 hover:bg-red-700 rounded-2xl text-xl font-semibold shadow-2xl shadow-red-600/30 transition-all active:scale-95"
            >
              Создать коллекцию <ArrowRight className="w-6 h-6" />
            </Link>
          )}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <ArrowRight className="w-6 h-6 rotate-90 text-white/50" />
      </motion.div>
    </section>
  );
}

/* ================== Экран 2: Как это работает (интерактивная демонстрация) ================== */
function HowItWorks() {
  const [step, setStep] = useState(0); // 0 - выбор, 1 - анимация, 2 - готово
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const demofilms = [
    {
      id: 1,
      title: "Интерстеллар",
      year: 2014,
      rating: 8.6,
      poster:
        "https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/4e1e85e1-2a4c-4f8d-8bcb-4d4e8e5e3c5f/80x120",
    },
    {
      id: 2,
      title: "Начало",
      year: 2010,
      rating: 8.7,
      poster:
        "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4c8b29d0-9b5c-4b4e-8b4b-8f5c2a7d7c1a/80x120",
    },
    {
      id: 3,
      title: "Побег из Шоушенка",
      year: 1994,
      rating: 9.1,
      poster:
        "https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/4c0d8e0a-7f1c-4c8e-8b4b-4f4d4d7e4b4f/80x120",
    },
    {
      id: 4,
      title: "Тёмный рыцарь",
      year: 2008,
      rating: 9.0,
      poster:
        "https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/4e1b8ec7-3c68-4b1b-8b4b-4d8e5f5c4d4f/80x120",
    },
  ];

  const handleSelectFilm = (film) => {
    if (isAnimating) return;
    setSelectedFilm(film);
    setShowCatalog(false);
    setStep(1);
    setIsAnimating(true);

    // Через время завершаем анимацию
    setTimeout(() => {
      setStep(2);
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <section className="py-32 bg-gradient-to-b from-zinc-900 to-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Как это работает
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto"
        >
          Пара кликов – и ваш фильм уже на носителе.
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Левая сторона: каталог или выбранный фильм */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            {step === 0 && !showCatalog && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCatalog(true)}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-lg shadow-xl shadow-red-600/20"
              >
                Выбрать фильм
              </motion.button>
            )}

            {showCatalog && step === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl"
              >
                {demofilms.map((film) => (
                  <div
                    key={film.id}
                    onClick={() => handleSelectFilm(film)}
                    className="bg-zinc-800/50 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-red-500/50 transition-all"
                  >
                    <img
                      src={film.poster}
                      alt={film.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 text-xs font-medium truncate">
                      {film.title}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {step >= 1 && selectedFilm && (
              <motion.div
                layoutId={`film-${selectedFilm.id}`}
                className="bg-zinc-800/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 w-64 relative z-10"
              >
                <img
                  src={selectedFilm.poster}
                  alt=""
                  className="w-16 h-24 object-cover rounded-lg"
                />
                <div className="text-left">
                  <h3 className="font-bold">{selectedFilm.title}</h3>
                  <p className="text-sm text-gray-400">
                    {selectedFilm.year} • {selectedFilm.rating}
                  </p>
                </div>
                {step === 2 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                  >
                    <Star className="w-4 h-4 text-white fill-current" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Правая сторона: флешка и прогресс */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="relative w-48 h-48 bg-zinc-800/30 border border-white/10 rounded-3xl flex items-center justify-center shadow-xl mb-4">
              <Usb className="w-16 h-16 text-red-400" />
              {/* Анимация полета карточки к флешке */}
              <AnimatePresence>
                {isAnimating && selectedFilm && (
                  <motion.div
                    key={`flying-${selectedFilm.id}`}
                    initial={{ opacity: 1, x: -200, y: 0, scale: 1 }}
                    animate={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute z-20"
                  >
                    <img
                      src={selectedFilm.poster}
                      alt=""
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Прогресс-бар */}
            <div className="w-48 h-2 bg-zinc-700 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: step === 2 ? "100%" : step === 1 ? "30%" : "0%",
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <p className="text-sm text-gray-400">
              {step === 2
                ? "Готово! Фильм записан."
                : step === 1
                ? "Запись..."
                : "Ожидание выбора"}
            </p>

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Link
                  to="/constructor"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold shadow-xl transition-all"
                >
                  Попробовать в конструкторе <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================== Экран 3: Преимущества ================== */
function Advantages() {
  return (
    <section className="py-32 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-20"
        >
          Всегда с тобой
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {useCases.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="text-center group"
            >
              <div className="overflow-hidden rounded-3xl mb-6 shadow-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <item.icon className="w-10 h-10 mx-auto mb-3 text-red-400" />
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================== Экран 4: Призыв к действию ================== */
function CTA() {
  return (
    <section className="py-32 bg-gradient-to-b from-black to-zinc-900 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Готовы собрать свою коллекцию?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-gray-400 mb-12"
        >
          Выбирайте фильмы, носитель и получайте заказ за пару дней.
        </motion.p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/constructor"
            className="px-10 py-5 bg-red-600 hover:bg-red-700 rounded-2xl text-xl font-semibold shadow-2xl shadow-red-600/30 transition-all active:scale-95"
          >
            Конструктор
          </Link>
          <Link
            to="/libraries"
            className="px-10 py-5 border border-white/30 hover:bg-white/10 rounded-2xl text-xl font-semibold transition-all active:scale-95"
          >
            Готовые библиотеки
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================== ГЛАВНАЯ СТРАНИЦА ================== */
export default function HomePage() {
  return (
    <div className="bg-black text-white">
      <Hero />
      <HowItWorks />
      <Advantages />
      <CTA />
    </div>
  );
}
