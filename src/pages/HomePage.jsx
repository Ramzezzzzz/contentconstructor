import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Plane, Car, Tent, ArrowRight, Usb, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.BASE_URL;
const API_KEY = "7fd95d4b-d51b-4959-9e36-408eb4dcba93";
const API_BASE = "/movie/api";

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

// Экран 1: Герой
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

// Экран 2: Демо-конструктор (сквозная синхронизация)
function HowItWorks() {
  const { user, token } = useAuth();
  const [films, setFilms] = useState([]); // 10 демо-фильмов
  const [collection, setCollection] = useState([]); // общая коллекция
  const [flying, setFlying] = useState(null);
  const usbRef = useRef(null);

  // Загрузка демо-каталога
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
      .catch(() => {});
  }, []);

  // Загрузка коллекции из localStorage (при монтировании)
  useEffect(() => {
    const saved = localStorage.getItem("constructorCollection");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCollection(parsed);
      } catch (e) {}
    }
  }, []);

  // Синхронизация коллекции в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("constructorCollection", JSON.stringify(collection));
  }, [collection]);

  // Обработчик клика по демо-постеру (добавляет/удаляет через API)
  const handleDemoClick = async (film, event) => {
    if (!user || !token) {
      alert("Войдите, чтобы сохранять фильмы");
      return;
    }

    const movieId = film.filmId;
    const isInCollection = collection.some((m) => m.kinopoisk_id == movieId);

    if (isInCollection) {
      // Удаляем из коллекции
      try {
        const res = await fetch(`${API_BASE}/collection.php`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ kinopoisk_id: movieId }),
        });
        if (res.ok) {
          setCollection((prev) =>
            prev.filter((m) => m.kinopoisk_id != movieId)
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Добавляем с анимацией полёта
      const usbRect = usbRef.current?.getBoundingClientRect();
      const endX = usbRect
        ? usbRect.left + usbRect.width / 2
        : window.innerWidth / 2;
      const endY = usbRect
        ? usbRect.top + usbRect.height / 2
        : window.innerHeight / 2;

      setFlying({
        film,
        startX: event.clientX,
        startY: event.clientY,
        endX,
        endY,
      });
      setTimeout(() => setFlying(null), 700);

      try {
        const res = await fetch(`${API_BASE}/collection.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            kinopoisk_id: movieId,
            title: film.nameRu || film.nameEn || "Без названия",
            poster_url: film.posterUrl || "",
            rating: film.rating || 0,
          }),
        });
        if (res.ok) {
          setCollection((prev) => [
            ...prev,
            {
              kinopoisk_id: movieId,
              title: film.nameRu || film.nameEn,
              poster_url: film.posterUrl,
              rating: film.rating,
            },
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const displayCount = collection.length;

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
          Нажимайте на постеры — фильмы отправятся на флешку. Повторное нажатие
          уберёт фильм.
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Демо-каталог */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-2xl">
            {films.map((film) => (
              <motion.div
                key={film.filmId}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => handleDemoClick(film, e)}
                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  collection.some((m) => m.kinopoisk_id == film.filmId)
                    ? "border-red-500 shadow-lg shadow-red-500/20"
                    : "border-transparent hover:border-white/30"
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
                {collection.some((m) => m.kinopoisk_id == film.filmId) && (
                  <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1">
                    <X className="w-3 h-3" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs font-bold truncate">{film.nameRu}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Визуальная флешка */}
          <div className="flex flex-col items-center gap-4 relative">
            <div
              ref={usbRef}
              className="relative w-36 h-48 bg-zinc-800/50 border border-white/10 rounded-2xl flex flex-col justify-end items-center shadow-xl overflow-hidden p-2"
            >
              <div className="w-full flex flex-wrap justify-center items-end gap-1 mb-2">
                <AnimatePresence>
                  {collection.slice(0, 16).map((movie) => (
                    <motion.div
                      key={movie.kinopoisk_id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="w-6 h-9 rounded-sm overflow-hidden border border-white/20 relative group"
                    >
                      <img
                        src={
                          movie.poster_url ||
                          "https://via.placeholder.com/24x36?text=?"
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/24x36?text=?";
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Usb className="w-8 h-8 text-red-400 absolute top-2 right-2 opacity-50" />
              <div className="text-xs text-gray-400">{displayCount} / 10</div>
            </div>
            <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-orange-400"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (displayCount / 10) * 100)}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div
              className="flex justify-center mt-2"
              style={{ minWidth: "240px" }}
            >
              <p className="text-sm text-gray-400">
                {displayCount === 0
                  ? "Кликните на фильм, чтобы добавить"
                  : `Выбрано: ${displayCount}`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12 h-16">
          <Link
            to="/constructor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold shadow-xl shadow-red-600/20 transition-all"
          >
            Открыть конструктор <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Анимация полёта */}
      <AnimatePresence>
        {flying && (
          <motion.div
            key={flying.film.filmId}
            initial={{
              position: "fixed",
              left: flying.startX,
              top: flying.startY,
              opacity: 1,
              scale: 1,
              zIndex: 200,
              pointerEvents: "none",
            }}
            animate={{
              left: flying.endX,
              top: flying.endY,
              opacity: 0,
              scale: 0.3,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <img
              src={flying.film.posterUrl}
              alt={flying.film.nameRu}
              className="w-12 h-16 object-cover rounded-lg shadow-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Экран 3: Преимущества
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

// Экран 4: CTA
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
