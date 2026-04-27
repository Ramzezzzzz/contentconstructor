import { useState, useEffect, useRef } from "react";
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
import { useAuth } from "../context/AuthContext";

const API_KEY = "7fd95d4b-d51b-4959-9e36-408eb4dcba93";
const BASE_URL_22 = "https://kinopoiskapiunofficial.tech/api/v2.2"; // для обычных подборок
const BASE_URL_21 = "https://kinopoiskapiunofficial.tech/api/v2.1"; // для поиска сериалов

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
    description: "Лучшие фильмы по рейтингу Кинопоиска",
    icon: Star,
    color: "from-amber-600/20 to-amber-600/5",
    borderColor: "border-amber-600/30",
    url: `${BASE_URL_22}/films/top?type=TOP_250_BEST_FILMS&page=1`,
    apiVersion: "2.2",
  },
  {
    name: "Популярное",
    description: "Что смотрят прямо сейчас",
    icon: Star,
    color: "from-orange-600/20 to-orange-600/5",
    borderColor: "border-orange-600/30",
    url: `${BASE_URL_22}/films/top?type=TOP_100_POPULAR_FILMS&page=1`,
    apiVersion: "2.2",
  },
  {
    name: "Сериалы",
    description: "Лучшие сериалы со всеми сезонами",
    icon: Monitor,
    color: "from-blue-600/20 to-blue-600/5",
    borderColor: "border-blue-600/30",
    // Используем поиск по ключевому слову «сериал» через v2.1
    url: `${BASE_URL_21}/films/search-by-keyword?keyword=${encodeURIComponent(
      "сериал"
    )}&page=1`,
    apiVersion: "2.1",
  },
  {
    name: "Новинки",
    description: "Свежие премьеры этого года",
    icon: Sparkles,
    color: "from-purple-600/20 to-purple-600/5",
    borderColor: "border-purple-600/30",
    url: `${BASE_URL_22}/films/premieres?year=2026&month=${getCurrentMonth()}`,
    apiVersion: "2.2",
  },
];

async function fetchMovies(url) {
  try {
    const res = await fetch(url, {
      headers: { "X-API-KEY": API_KEY, "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.error(`Ошибка загрузки категории: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.films?.slice(0, 12) || [];
  } catch (error) {
    console.error("Ошибка сети:", error);
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

const getRatingColor = (rating) => {
  if (rating >= 7.5) return "text-green-400";
  if (rating >= 6) return "text-yellow-400";
  return "text-red-400";
};

function MovieDetailModal({
  movie,
  onClose,
  isInCollection,
  onAddToCollection,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  // Определяем ID фильма (может быть kinopoiskId или filmId)
  const movieId = movie.kinopoiskId || movie.filmId || "";
  const title = movie.nameRu || movie.nameEn || "Без названия";

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
        className="w-full md:max-w-lg bg-zinc-900 border border-white/10 md:rounded-2xl max-h-[90vh] overflow-y-auto p-6 pt-12 relative"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:text-red-500 transition-colors z-10"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <ImageWithFallback
            src={movie.posterUrl}
            alt={title}
            className="w-40 h-56 md:w-48 md:h-64 object-cover rounded-xl mx-auto md:mx-0"
          />
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">{title}</h2>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current text-yellow-400" />
              <span
                className={`text-2xl font-bold ${getRatingColor(movie.rating)}`}
              >
                {movie.rating}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" /> {movie.filmLength || "—"} мин
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <HardDrive className="w-4 h-4" /> ≈ 2.5 ГБ
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Качество</p>
              <div className="flex flex-wrap gap-2">
                {["720p", "1080p", "4K"].map((q) => (
                  <span
                    key={q}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Аудио</p>
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

            <button
              onClick={onAddToCollection}
              disabled={isInCollection}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isInCollection
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isInCollection ? "В коллекции" : "Добавить в коллекцию"}
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
  const [collection, setCollection] = useState([]);

  const { user, token } = useAuth();

  // Загрузка категорий
  useEffect(() => {
    Promise.all(
      categories.map(async (cat) => {
        const movies = await fetchMovies(cat.url);
        return { ...cat, movies };
      })
    ).then((data) => {
      setLibraryData(data);
      setLoading(false);
    });
  }, []);

  // Загрузка коллекции пользователя
  useEffect(() => {
    if (!user || !token) return;
    fetch("/movie/api/collection.php", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCollection(data);
      })
      .catch(console.error);
  }, [user, token]);

  // Проверка наличия фильма в коллекции
  const isInCollection = (movie) => {
    const movieId = movie?.kinopoiskId || movie?.filmId;
    return collection.some((item) => item.kinopoisk_id === movieId);
  };

  // Добавление в коллекцию
  const handleAddToCollection = async (movie) => {
    if (!user || !token) return;
    const movieId = movie.kinopoiskId || movie.filmId;
    const title = movie.nameRu || movie.nameEn || "Без названия";

    console.log("Добавляем фильм:", { movieId, title, movie });

    try {
      const res = await fetch("/movie/api/collection.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          kinopoisk_id: movieId,
          title: title,
          poster_url: movie.posterUrl || "",
          rating: movie.rating || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка добавления");
      setCollection((prev) => [
        ...prev,
        {
          kinopoisk_id: movieId,
          title: title,
          poster_url: movie.posterUrl,
          rating: movie.rating,
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Не удалось добавить в коллекцию");
    }
  };

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

              {library.movies.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>В этой подборке пока нет фильмов.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {library.movies.map((movie) => {
                    const movieId = movie.kinopoiskId || movie.filmId;
                    return (
                      <motion.div
                        key={movieId}
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
                    );
                  })}
                </div>
              )}

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

      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            isInCollection={isInCollection(selectedMovie)}
            onAddToCollection={() => handleAddToCollection(selectedMovie)}
          />
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
