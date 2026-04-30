import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Plus,
  Trash2,
  Film,
  Star,
  Package,
  Monitor,
  Music,
  Users,
  BookOpen,
  Usb,
  Database,
  HardDrive,
  TrendingUp,
  Zap,
  Tv,
  Calendar,
  MonitorPlay,
  Volume2,
} from "lucide-react";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const API_KEY = "7fd95d4b-d51b-4959-9e36-408eb4dcba93";
const API_BASE = "/movie/api";

// Типы носителей с minHeight для растущего контейнера
const deviceTypes = {
  usb: {
    icon: Usb,
    name: "USB-флешка",
    maxCapacity: 256,
    color: "from-red-500 to-orange-400",
    basePrice: 2500,
    minHeight: "180px",
  },
  ssd: {
    icon: Database,
    name: "SSD",
    maxCapacity: 2048,
    color: "from-blue-500 to-cyan-400",
    basePrice: 8900,
    minHeight: "220px",
  },
  hdd: {
    icon: HardDrive,
    name: "HDD",
    maxCapacity: 8192,
    color: "from-yellow-500 to-amber-400",
    basePrice: 12500,
    minHeight: "260px",
  },
};

const collectionsQuick = [
  {
    key: "top250",
    label: "ТОП 250",
    icon: TrendingUp,
    endpoint: "/films/top",
    params: "type=TOP_250_BEST_FILMS&page=1",
    apiVersion: "v2.2",
  },
  {
    key: "popular",
    label: "Популярное",
    icon: Zap,
    endpoint: "/films/top",
    params: "type=TOP_100_POPULAR_FILMS&page=1",
    apiVersion: "v2.2",
  },
  {
    key: "series",
    label: "Сериалы",
    icon: Tv,
    endpoint: "/films/search-by-keyword",
    params: "keyword=сериал",
    apiVersion: "v2.1",
  },
  {
    key: "new",
    label: "Новинки",
    icon: Calendar,
    endpoint: "/films/premieres",
    params: "year=2026&month=JANUARY",
    apiVersion: "v2.2",
  },
];

const genres = [
  { name: "Боевик", keyword: "боевик", icon: Monitor },
  { name: "Комедия", keyword: "комедия", icon: Users },
  { name: "Музыка", keyword: "музыка", icon: Music },
  { name: "Документальное", keyword: "документальный", icon: BookOpen },
];

async function fetchMovies(endpoint, params, apiVersion = "v2.2") {
  const base =
    apiVersion === "v2.1"
      ? "https://kinopoiskapiunofficial.tech/api/v2.1"
      : "https://kinopoiskapiunofficial.tech/api/v2.2";
  const url = `${base}${endpoint}?${params}`;
  try {
    const res = await fetch(url, { headers: { "X-API-KEY": API_KEY } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.films?.slice(0, 20) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Визуальная панель носителя с растущим контейнером
function StoragePanel({
  collection,
  type,
  onChangeType,
  onRemove,
  storageRef,
}) {
  const device = deviceTypes[type];
  const totalSize = collection.length * 2.5;
  const fillPercent = Math.min(100, (totalSize / device.maxCapacity) * 100);
  const approxPrice = device.basePrice;
  const maxVisible = 16;
  const hiddenCount = collection.length - maxVisible;

  return (
    <div className="bg-zinc-800/30 border border-white/10 rounded-2xl p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5 text-red-500 shrink-0" />
        <select
          value={type}
          onChange={(e) => onChangeType(e.target.value)}
          className="bg-black border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:border-red-500 outline-none w-full"
        >
          {Object.entries(deviceTypes).map(([key, dev]) => (
            <option key={key} value={key}>
              {dev.name}
            </option>
          ))}
        </select>
      </div>

      <div
        ref={storageRef}
        className="relative bg-black/50 border border-white/10 rounded-2xl p-3 mx-auto transition-all duration-300"
        style={{ minHeight: device.minHeight }}
      >
        <div className="flex justify-between items-center mb-2">
          <device.icon className="w-6 h-6 text-white/70" />
          <span className="text-xs text-gray-400">
            {totalSize.toFixed(1)} / {device.maxCapacity} ГБ
          </span>
        </div>

        <div className="flex flex-wrap justify-start items-end gap-1 min-h-[40px]">
          <AnimatePresence>
            {collection.slice(0, maxVisible).map((movie) => (
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
                    e.target.src = "https://via.placeholder.com/24x36?text=?";
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(movie.kinopoisk_id);
                  }}
                  className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2 h-2" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {hiddenCount > 0 && (
            <div className="w-6 h-9 rounded-sm bg-zinc-700/50 flex items-center justify-center text-xs text-gray-400 border border-white/10">
              +{hiddenCount}
            </div>
          )}
          {collection.length === 0 && (
            <div className="text-gray-500 text-xs w-full text-center py-2">
              Добавьте фильм
            </div>
          )}
        </div>

        <div className="w-full h-2 bg-zinc-700 rounded-full mt-2 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${device.color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${fillPercent}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">≈ {approxPrice} ₽</span>
        <Link
          to={`/catalog?device=${type}&capacity=${Math.ceil(totalSize)}`}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors text-white"
        >
          Оформить заказ
        </Link>
      </div>
    </div>
  );
}

// Модальное окно с полноразмерным постером и кнопкой Убрать/Добавить
function MovieModal({ movie, onClose, isInCollection, onAdd, onRemove }) {
  if (!movie) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="relative flex-shrink-0">
          <img
            src={movie.posterUrl || ""}
            alt={movie.nameRu}
            className="w-full max-h-[50vh] object-contain bg-black"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-2">
            {movie.nameRu || movie.nameEn}
          </h2>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold">{movie.rating}</span>
            <span className="text-gray-400 text-sm">({movie.year || "—"})</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm flex items-center gap-2">
              <MonitorPlay className="w-4 h-4" /> 1080p
            </span>
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> RUS
            </span>
          </div>
          <button
            onClick={() => {
              if (isInCollection) {
                onRemove();
              } else {
                onAdd();
              }
              onClose();
            }}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              isInCollection
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isInCollection ? "Убрать из коллекции" : "Добавить в коллекцию"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ================== Главная страница конструктора ==================
export default function ConstructorPage() {
  const { user, token } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState([]);
  const [deviceType, setDeviceType] = useState("usb");
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeMode, setActiveMode] = useState("top250");
  const [activeGenre, setActiveGenre] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [flying, setFlying] = useState(null);
  const storageVisualRef = useRef(null);
  const searchInputRef = useRef(null);

  // Загрузка коллекции с сервера
  useEffect(() => {
    if (!user || !token) {
      setInitialLoad(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/collection.php`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setCollection(data);
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoad(false);
      }
    })();
  }, [user, token]);

  // Перенос демо-коллекции с главной
  useEffect(() => {
    if (!user || !token) return;
    const demoIds = localStorage.getItem("demoCollection");
    if (!demoIds) return;
    const ids = JSON.parse(demoIds);
    if (!Array.isArray(ids) || ids.length === 0) return;
    ids.forEach(async (filmId) => {
      try {
        const res = await fetch(
          `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`,
          { headers: { "X-API-KEY": API_KEY } }
        );
        const movie = await res.json();
        if (movie) await addToCollection(movie);
      } catch (err) {
        console.error(err);
      }
    });
    localStorage.removeItem("demoCollection");
  }, [user, token]);

  // Синхронизация коллекции с localStorage (для главной страницы)
  useEffect(() => {
    localStorage.setItem("constructorCollection", JSON.stringify(collection));
  }, [collection]);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    let movies = [];
    try {
      if (activeMode === "search" && query.trim().length >= 2) {
        movies = await fetchMovies(
          "/films/search-by-keyword",
          `keyword=${encodeURIComponent(query)}`,
          "v2.1"
        );
      } else if (activeMode && activeMode.startsWith("genre:")) {
        const keyword = activeMode.replace("genre:", "");
        movies = await fetchMovies(
          "/films/search-by-keyword",
          `keyword=${encodeURIComponent(keyword)}`,
          "v2.1"
        );
      } else if (
        activeMode &&
        collectionsQuick.some((c) => c.key === activeMode)
      ) {
        const coll = collectionsQuick.find((c) => c.key === activeMode);
        movies = await fetchMovies(
          coll.endpoint,
          coll.params,
          coll.apiVersion || "v2.2"
        );
      }
    } catch (err) {
      console.error(err);
    }
    setResults(movies);
    setLoading(false);
  }, [activeMode, query]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const addToCollection = async (movie) => {
    if (!user || !token) return;
    const movieId = movie.filmId || movie.kinopoiskId;
    if (collection.some((item) => item.kinopoisk_id == movieId)) return;
    try {
      const res = await fetch(`${API_BASE}/collection.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          kinopoisk_id: movieId,
          title: movie.nameRu || movie.nameEn || "Без названия",
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
          title: movie.nameRu || movie.nameEn,
          poster_url: movie.posterUrl,
          rating: movie.rating,
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Не удалось добавить фильм: " + err.message);
    }
  };

  const removeFromCollection = async (kinopoiskId) => {
    if (!user || !token) return;
    try {
      const res = await fetch(`${API_BASE}/collection.php`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ kinopoisk_id: kinopoiskId }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error || "Ошибка удаления");
      setCollection((prev) =>
        prev.filter((item) => item.kinopoisk_id != kinopoiskId)
      );
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить фильм: " + err.message);
    }
  };

  // Клик по постеру → открыть модалку
  const handlePosterClick = (movie) => {
    setSelectedMovie(movie);
  };

  // Клик по кнопке «Добавить»/«Убрать» с анимацией
  const handleAddClick = (movie, event) => {
    event.stopPropagation();
    if (
      collection.some(
        (m) => m.kinopoisk_id == (movie.filmId || movie.kinopoiskId)
      )
    ) {
      removeFromCollection(movie.filmId || movie.kinopoiskId);
      return;
    }
    const visualRect = storageVisualRef.current?.getBoundingClientRect();
    if (visualRect) {
      setFlying({
        film: movie,
        startX: event.clientX,
        startY: event.clientY,
        endX: visualRect.left + visualRect.width / 2,
        endY: visualRect.top + visualRect.height / 2,
      });
      setTimeout(() => setFlying(null), 700);
    }
    addToCollection(movie);
  };

  const handleCollectionClick = (key) => {
    setActiveGenre(null);
    setActiveMode(key);
    setQuery("");
  };
  const handleGenreClick = (genre) => {
    setActiveMode(`genre:${genre.keyword}`);
    setActiveGenre(genre.name);
    setQuery("");
  };
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setActiveMode("search");
      setActiveGenre(null);
    } else {
      setActiveMode("top250");
    }
  };

  if (initialLoad)
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

  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Конструктор и библиотека
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Выбирайте готовые подборки, ищите по жанру или названию и
              сохраняйте фильмы на носитель.
            </p>
          </motion.div>

          {/* Подборки, поиск, жанры */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {collectionsQuick.map((col) => (
              <button
                key={col.key}
                onClick={() => handleCollectionClick(col.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                  activeMode === col.key
                    ? "bg-red-600 border-red-600 text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-red-500/50"
                }`}
              >
                <col.icon className="w-5 h-5" />
                {col.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Поиск по названию..."
                className="w-full py-4 pl-12 pr-12 bg-zinc-800/50 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-red-500 outline-none transition-colors text-lg"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveMode("top250");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {loading && (
              <div className="absolute -bottom-8 left-0 right-0 text-center text-gray-400 text-sm">
                Поиск...
              </div>
            )}
          </div>

          <div className="flex justify-center flex-wrap gap-3 mb-8">
            {genres.map((genre) => (
              <button
                key={genre.name}
                onClick={() => handleGenreClick(genre)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  activeGenre === genre.name
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-red-500/50"
                }`}
              >
                <genre.icon className="w-4 h-4" />
                {genre.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {results.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {activeMode === "search"
                      ? `Поиск: ${query}`
                      : activeGenre
                      ? `Жанр: ${activeGenre}`
                      : collectionsQuick.find((c) => c.key === activeMode)
                          ?.label}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <AnimatePresence>
                      {results.map((movie) => (
                        <motion.div
                          key={movie.filmId || movie.kinopoiskId}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative overflow-hidden rounded-xl bg-zinc-800/50 border border-white/10 group"
                          onClick={() => handlePosterClick(movie)}
                        >
                          <img
                            src={
                              movie.posterUrl ||
                              "https://via.placeholder.com/300x450?text=Нет постера"
                            }
                            alt={movie.nameRu}
                            className="w-full h-52 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x450?text=Нет постера";
                            }}
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-sm font-bold truncate">
                              {movie.nameRu}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{movie.rating}</span>
                              </div>
                              <button
                                onClick={(e) => handleAddClick(movie, e)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                  collection.some(
                                    (m) =>
                                      m.kinopoisk_id ==
                                      (movie.filmId || movie.kinopoiskId)
                                  )
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-red-600/80 hover:bg-red-600 text-white"
                                }`}
                              >
                                {collection.some(
                                  (m) =>
                                    m.kinopoisk_id ==
                                    (movie.filmId || movie.kinopoiskId)
                                )
                                  ? "Убрать"
                                  : "Добавить"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <Film className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">
                    {loading ? "Загрузка..." : "Ничего не найдено"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <StoragePanel
                collection={collection}
                type={deviceType}
                onChangeType={setDeviceType}
                onRemove={removeFromCollection}
                storageRef={storageVisualRef}
              />
            </div>
          </div>
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

      {/* Модальное окно с детализацией */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            isInCollection={collection.some(
              (m) =>
                m.kinopoisk_id ==
                (selectedMovie.filmId || selectedMovie.kinopoiskId)
            )}
            onAdd={() => {
              const movie = selectedMovie;
              if (
                !collection.some(
                  (m) => m.kinopoisk_id == (movie.filmId || movie.kinopoiskId)
                )
              ) {
                addToCollection(movie);
              }
            }}
            onRemove={() => {
              const movie = selectedMovie;
              removeFromCollection(movie.filmId || movie.kinopoiskId);
            }}
          />
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
