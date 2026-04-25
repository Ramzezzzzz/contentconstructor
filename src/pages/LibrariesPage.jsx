import { useState, useEffect } from "react";
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
} from "lucide-react";
import AnimatedPage from "../components/AnimatedPage";

const API_KEY = "7fd95d4b-d51b-4959-9e36-408eb4dcba93";
const BASE_URL = "https://kinopoiskapiunofficial.tech/api/v2.2";

// Вспомогательная функция для получения текущего месяца
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

const categories = [
  {
    name: "ТОП 250",
    description:
      "Лучшие фильмы по рейтингу Кинопоиска. Классика и современное кино.",
    count: "Рейтинг 7.5+",
    icon: Star,
    color: "from-amber-600/20 to-amber-600/5",
    borderColor: "border-amber-600/30",
    endpoint: "/films/top",
    params: "type=TOP_250_BEST_FILMS&page=1",
  },
  {
    name: "Популярное",
    description: "Что смотрят прямо сейчас. Тренды и хиты.",
    count: "Топ-100",
    icon: Star,
    color: "from-orange-600/20 to-orange-600/5",
    borderColor: "border-orange-600/30",
    endpoint: "/films/top",
    params: "type=TOP_100_POPULAR_FILMS&page=1",
  },
  {
    name: "Сериалы",
    description: "Топовые сериалы. Полные сезоны.",
    count: "Рейтинг 7.0+",
    icon: Monitor,
    color: "from-blue-600/20 to-blue-600/5",
    borderColor: "border-blue-600/30",
    endpoint: "/films/top",
    params: "type=TOP_250_TV_SHOWS&page=1",
  },
  {
    name: "Новинки 2026",
    description: "Свежие премьеры этого года.",
    count: "Новое",
    icon: Sparkles,
    color: "from-purple-600/20 to-purple-600/5",
    borderColor: "border-purple-600/30",
    endpoint: "/films/premieres",
    params: `year=2026&month=${getCurrentMonth()}`,
  },
];

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

// Компонент детального попапа
function MovieDetailModal({ movie, onClose }) {
  if (!movie) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden"
      >
        <div className="flex justify-between items-start p-6 pb-2">
          <h2 className="text-2xl font-bold">{movie.nameRu || movie.nameEn}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <ImageWithFallback
            src={movie.posterUrl}
            alt={movie.nameRu}
            className="w-full rounded-xl object-cover"
          />
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Рейтинг Кинопоиска</p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-zinc-700 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{ width: `${(movie.rating / 10) * 100}%` }}
                  />
                </div>
                <span className="font-bold">{movie.rating}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Качество</p>
              <div className="flex gap-2">
                {["720p", "1080p", "4K"].map((quality) => (
                  <span
                    key={quality}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm"
                  >
                    {quality}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Аудиодорожки</p>
              <div className="flex flex-wrap gap-2">
                {["RUS", "ENG", "UKR"].map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" /> {lang}
                  </span>
                ))}
              </div>
            </div>
            <button className="w-full py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-medium">
              Добавить в коллекцию
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

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
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Готовые библиотеки
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Кураторские подборки лучших фильмов всех времен — от классики до
              новинок
            </p>
          </motion.div>

          {libraryData.map((library, index) => (
            <motion.div
              key={library.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`mb-12 p-8 bg-gradient-to-br ${library.color} border ${library.borderColor} rounded-2xl`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                <library.icon className="w-12 h-12 text-red-500" />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold">{library.name}</h2>
                  <p className="text-gray-400">{library.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <HardDrive className="w-4 h-4" />
                    <span>≈ {library.movies.length * 2} GB</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>≈ {library.movies.length * 2} ч</span>
                  </div>
                </div>
              </div>

              {library.movies.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Скоро здесь появятся фильмы. Следите за обновлениями!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {library.movies.map((movie) => (
                    <motion.div
                      key={movie.kinopoiskId}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedMovie(movie)}
                      className="relative overflow-hidden rounded-xl bg-zinc-800/50 border border-white/10 group cursor-pointer"
                    >
                      <ImageWithFallback
                        src={movie.posterUrl}
                        alt={movie.nameRu}
                        className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-sm font-bold truncate">
                          {movie.nameRu}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-red-400">
                          <div className="w-full bg-zinc-700 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-red-500 h-1.5 rounded-full"
                              style={{ width: `${(movie.rating / 10) * 100}%` }}
                            />
                          </div>
                          <span>{movie.rating}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Выберите носитель при оформлении</span>
                </div>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium">
                  Заказать подборку
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
