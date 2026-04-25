import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Calendar,
  Sparkles,
  Package,
  Film,
  X,
  Monitor,
  Volume2,
  HardDrive,
  Clock,
  ChevronDown,
} from "lucide-react";
import AnimatedPage from "../components/AnimatedPage";

const API_KEY = "7fd95d4b-d51b-4959-9e36-408eb4dcba93";
const BASE_URL = "https://kinopoiskapiunofficial.tech/api/v2.2";

// Получение текущего месяца для новинок
const getCurrentMonth = () => {
  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];
  return months[new Date().getMonth()];
};

// Категории подборок
const categories = [
  {
    name: "ТОП 250",
    description: "Лучшие фильмы по рейтингу Кинопоиска",
    icon: Star,
    color: "from-amber-600/20 to-amber-600/5",
    borderColor: "border-amber-600/30",
    endpoint: "/films/top",
    params: "type=TOP_250_BEST_FILMS&page=1",
  },
  {
    name: "Популярное",
    description: "Что смотрят прямо сейчас",
    icon: Star,
    color: "from-orange-600/20 to-orange-600/5",
    borderColor: "border-orange-600/30",
    endpoint: "/films/top",
    params: "type=TOP_100_POPULAR_FILMS&page=1",
  },
  {
    name: "Сериалы",
    description: "Лучшие сериалы со всеми сезонами",
    icon: Monitor,
    color: "from-blue-600/20 to-blue-600/5",
    borderColor: "border-blue-600/30",
    endpoint: "/films/top",
    params: "type=TOP_250_TV_SHOWS&page=1",
  },
  {
    name: "Новинки",
    description: "Свежие премьеры этого года",
    icon: Sparkles,
    color: "from-purple-600/20 to-purple-600/5",
    borderColor: "border-purple-600/30",
    endpoint: "/films/premieres",
    params: `year=2026&month=${getCurrentMonth()}`,
  },
];

// Загрузка фильмов
async function fetchMovies(endpoint, params) {
  const url = `${BASE_URL}${endpoint}?${params}`;
  try {
    const res = await fetch(url, {
      headers: { "X-API-KEY": API_KEY, "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.films?.slice(0, 12) || [];
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return [];
  }
}

// Заглушка для постера
const ImageWithFallback = ({ src, alt, className }) => {
  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/300x450?text=Нет+постера";
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

// Цвет рейтинга
const getRatingColor = (rating) => {
  if (rating >= 7.5) return "text-green-400";
  if (rating >= 6) return "text-yellow-400";
  return "text-red-400";
};

// Детальное модальное окно
function MovieDetailModal({ movie, onClose }) {
  const closeButtonRef = useRef(null);

  // Закрытие по Esc и ловушка фокуса
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Переводим фокус на кнопку закрытия при открытии
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  // Примерные данные (если нет в API)
  const fileSizeGB = movie.filmLength
    ? Math.round((movie.filmLength * 1.5) / 60 / 1024, 1)
    : 2.5;
  const duration = movie.filmLength ? `${movie.filmLength} мин` : "Не указано";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-lg bg-zinc-900 border border-white/10 md:rounded-2xl 
                   max-h-[90vh] overflow-y-auto p-6 pt-12 relative"
      >
        {/* Кнопка закрытия */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:text-red-500 transition-colors z-10"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Контент */}
        <div className="flex flex-col md:flex-row gap-6">
          <ImageWithFallback
            src={movie.posterUrl}
            alt={movie.nameRu}
            className="w-40 h-56 md:w-48 md:h-64 object-cover rounded-xl mx-auto md:mx-0"
          />
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">
              {movie.nameRu || movie.nameEn}
            </h2>

            {/* Рейтинг (улучшен) */}
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current text-yellow-400" />
              <span
                className={`text-2xl font-bold ${getRatingColor(movie.rating)}`}
              >
                {movie.rating}
              </span>
              {movie.ratingVoteCount && (
                <span className="text-sm text-gray-400">
                  ({new Intl.NumberFormat("ru").format(movie.ratingVoteCount)}{" "}
                  оценок)
                </span>
              )}
            </div>

            {/* Характеристики */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" /> {duration}
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <HardDrive className="w-4 h-4" /> ≈ {fileSizeGB} ГБ
              </div>
            </div>

            {/* Качество */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Качество</p>
              <div className="flex flex-wrap gap-2">
                {["720p", "1080p", "4K"].map((q) => (
                  <span
                    key={q}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm cursor-pointer hover:border-red-500 transition-colors"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>

            {/* Аудиодорожки */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Аудио</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { lang: "RUS", label: "Русский" },
                  { lang: "ENG", label: "Английский" },
                  { lang: "UKR", label: "Украинский" },
                ].map((audio) => (
                  <span
                    key={audio.lang}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm flex items-center gap-1 hover:border-red-500 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" /> {audio.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Кнопка в корзину */}
            <button className="w-full py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-medium">
              Добавить в коллекцию
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Главная страница библиотек
export default function LibrariesPage() {
  const [libraryData, setLibraryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    Promise.all(
      categories.map(async (cat) => {
        const movies = await fetchMovies(cat.endpoint, cat.params);
        return { ...cat, movies };
      })
    ).then((data) => {
      setLibraryData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Film className="w-16 h-16 text-red-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Готовые библиотеки
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Кураторские подборки лучших фильмов для вашего носителя
            </p>
          </motion.div>

          {libraryData.map((library, index) => (
            <motion.div
              key={library.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`mb-8 p-6 md:p-8 bg-gradient-to-br ${library.color} border ${library.borderColor} rounded-2xl`}
            >
              {/* Заголовок категории */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <library.icon className="w-10 h-10 text-red-500" />
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {library.name}
                  </h2>
                  <p className="text-gray-400">{library.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-4 h-4" />
                    <span>≈ {library.movies.length * 2} ГБ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>≈ {library.movies.length * 2} ч</span>
                  </div>
                </div>
              </div>

              {/* Сетка постеров */}
              {library.movies.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>В этой подборке пока нет фильмов.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {library.movies.map((movie) => (
                    <motion.div
                      key={movie.kinopoiskId}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setSelectedMovie(movie)}
                      className="relative overflow-hidden rounded-xl bg-zinc-800/50 border border-white/10 group cursor-pointer"
                    >
                      <ImageWithFallback
                        src={movie.posterUrl}
                        alt={movie.nameRu}
                        className="w-full h-52 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-sm font-bold truncate">
                          {movie.nameRu}
                        </h3>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className={getRatingColor(movie.rating)}>
                            {movie.rating}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Выберите носитель при оформлении заказа</span>
                </div>
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium">
                  Заказать подборку
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Модалка с фильмом */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
