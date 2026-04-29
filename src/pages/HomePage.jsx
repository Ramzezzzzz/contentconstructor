import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Star,
  Plane,
  Car,
  Tent,
  ArrowRight,
  Film,
  Usb,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.BASE_URL;
const API_KEY = "7fd95d4b-d51b-4959-9e36-408eb4dcba93";

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

/* ---------- Экран 1: Герой (без кнопок, только текст) ---------- */
function Hero() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
      <motion.div
        style={{ y, backgroundImage: `url(${BASE_URL}images/hero_bg.webp)` }}
        className="absolute inset-0 bg-cover bg-center opacity-30"
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6"
      >
        {user
          ? `С возвращением, ${user.name || "друг"}!`
          : "Твой офлайн‑кинотеатр"}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-xl mx-auto mb-8"
      >
        {user
          ? "Ваша коллекция ждёт."
          : "Коллекции фильмов на USB, SSD и жёстких дисках. Смотри где угодно, без интернета."}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10"
      >
        <ArrowRight className="w-6 h-6 rotate-90 text-white/50" />
      </motion.div>
    </section>
  );
}

/* ---------- Экран 2: Как это работает (демо с анимацией полёта) ---------- */
function HowItWorks() {
  const [films, setFilms] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [flyingFilm, setFlyingFilm] = useState(null); // один фильм, который сейчас летит

  // Загрузка реальных популярных фильмов из API
  useEffect(() => {
    fetch(
      `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1`,
      {
        headers: { "X-API-KEY": API_KEY },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.films) setFilms(data.films.slice(0, 10));
      })
      .catch(() => {
        // fallback — пустой массив, можно ничего не показывать
      });
  }, []);

  const handleSelect = (film) => {
    const id = film.filmId;
    if (selectedIds.includes(id)) return; // уже выбран
    setSelectedIds((prev) => [...prev, id]);
    // Запускаем анимацию полёта
    setFlyingFilm(film);
    setTimeout(() => setFlyingFilm(null), 800);
  };

  const selectedFilms = films.filter((f) => selectedIds.includes(f.filmId));

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
        >
          Как это работает
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Просто кликните на постер — фильм отправится на флешку.
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Сетка фильмов (реальные постеры) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-2xl">
            {films.map((film) => (
              <motion.div
                key={film.filmId}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSelect(film)}
                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedIds.includes(film.filmId)
                    ? "border-red-500 opacity-80"
                    : "border-transparent"
                }`}
              >
                <img
                  src={
                    film.posterUrl ||
                    "https://via.placeholder.com/200x300?text=Нет"
                  }
                  alt={film.nameRu}
                  className="w-full h-36 sm:h-44 object-cover"
                />
                {selectedIds.includes(film.filmId) && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      Выбрано
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Визуальная флешка */}
          <div className="flex flex-col items-center gap-4 relative">
            <div className="relative w-32 h-40 bg-zinc-800/50 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
              <Usb className="w-12 h-12 text-red-400" />
              {/* Анимация летящего постера */}
              <AnimatePresence>
                {flyingFilm && (
                  <motion.div
                    key={flyingFilm.filmId}
                    initial={{ opacity: 1, x: -100, y: -50, scale: 0.7 }}
                    animate={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute z-20"
                  >
                    <img
                      src={flyingFilm.posterUrl}
                      alt=""
                      className="w-12 h-16 object-cover rounded-lg"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute -bottom-1 left-0 right-0 text-center text-xs text-gray-500">
                {selectedFilms.length} из 10
              </div>
            </div>
            <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${(selectedFilms.length / 10) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Link
            to="/constructor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold shadow-xl shadow-red-600/20 transition-all"
          >
            Попробовать в конструкторе <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Экран 3: Преимущества ---------- */
function Advantages() {
  return (
    <section className="py-20 sm:py-32 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-20">
          Всегда с тобой
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

/* ---------- Экран 4: CTA ---------- */
function CTA() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-black to-zinc-900 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
        >
          Готовы собрать свою коллекцию?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-lg sm:text-xl text-gray-400 mb-12"
        >
          Выбирайте фильмы, носитель и получайте заказ за пару дней.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/constructor"
            className="px-10 py-5 bg-red-600 hover:bg-red-700 rounded-2xl text-xl font-semibold shadow-2xl shadow-red-600/30 transition-all active:scale-95"
          >
            Конструктор
          </Link>
          <Link
            to="/catalog"
            className="px-10 py-5 border border-white/30 hover:bg-white/10 rounded-2xl text-xl font-semibold transition-all active:scale-95"
          >
            Выбрать носитель
          </Link>
        </div>
      </div>
    </section>
  );
}

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
