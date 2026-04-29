import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Plus,
  Trash2,
  Clock,
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
  Zap,
  TrendingUp,
  Tv,
  Calendar,
} from "lucide-react";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const API_KEY = "7fd95d4b-d51b-4959-9e36-408eb4dcba93";
const API_BASE = "/movie/api";

// ---------- Типы носителей ----------
const deviceTypes = {
  usb: {
    icon: Usb,
    name: "USB-флешка",
    maxCapacity: 256,
    label: "ГБ",
    color: "from-red-500 to-orange-400",
  },
  ssd: {
    icon: Database,
    name: "SSD",
    maxCapacity: 2048,
    label: "ГБ",
    color: "from-blue-500 to-cyan-400",
  },
  hdd: {
    icon: HardDrive,
    name: "HDD",
    maxCapacity: 8192,
    label: "ГБ",
    color: "from-yellow-500 to-amber-400",
  },
};

// ---------- Готовые подборки (кнопки) ----------
const collectionsQuick = [
  {
    key: "top250",
    label: "ТОП 250",
    icon: TrendingUp,
    endpoint: "/films/top",
    params: "type=TOP_250_BEST_FILMS",
    color: "from-amber-600/20 to-amber-600/5",
  },
  {
    key: "popular",
    label: "Популярное",
    icon: Zap,
    endpoint: "/films/top",
    params: "type=TOP_100_POPULAR_FILMS",
    color: "from-orange-600/20 to-orange-600/5",
  },
  {
    key: "series",
    label: "Сериалы",
    icon: Tv,
    endpoint: "/films/search-by-keyword",
    params: "keyword=сериал",
    color: "from-blue-600/20 to-blue-600/5",
    apiVersion: "v2.1",
  },
  {
    key: "new",
    label: "Новинки",
    icon: Calendar,
    endpoint: "/films/premieres",
    params: "year=2026&month=JANUARY",
    color: "from-purple-600/20 to-purple-600/5",
  },
];

// ---------- Работающие жанры ----------
const genres = [
  { name: "Боевик", keyword: "боевик", icon: Monitor },
  { name: "Комедия", keyword: "комедия", icon: Users },
  { name: "Музыка", keyword: "музыка", icon: Music },
  { name: "Документальное", keyword: "документальный", icon: BookOpen },
];

// ---------- Компонент для загрузки фильмов (из готовых подборок или поиска) ----------
async function fetchMovies(endpoint, params, apiVersion = "v2.2") {
  const base =
    apiVersion === "v2.1"
      ? "https://kinopoiskapiunofficial.tech/api/v2.1"
      : "https://kinopoiskapiunofficial.tech/api/v2.2";
  const url = `${base}${endpoint}?${params}`;
  try {
    const res = await fetch(url, {
      headers: { "X-API-KEY": API_KEY, "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.films?.slice(0, 20) || [];
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return [];
  }
}

// ---------- Визуальная флешка ----------
function StorageFiller({ collection, type, onChangeType, onRemove }) {
  const device = deviceTypes[type];
  const totalSize = collection.length * 2.5; // ~2.5 ГБ/фильм
  const fillPercent = Math.min(100, (totalSize / device.maxCapacity) * 100);

  return (
    <div className="bg-zinc-800/30 border border-white/10 rounded-2xl p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-red-500" />
        <select
          value={type}
          onChange={(e) => onChangeType(e.target.value)}
          className="bg-black border border-white/20 rounded-xl px-3 py-1 text-white text-sm focus:border-red-500 outline-none"
        >
          {Object.entries(deviceTypes).map(([key, dev]) => (
            <option key={key} value={key}>
              {dev.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative bg-black/50 border border-white/10 rounded-2xl p-4 mb-4 overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <device.icon className="w-8 h-8 text-white/80" />
          <span className="text-sm text-gray-400">
            {totalSize.toFixed(1)} из {device.maxCapacity} {device.label}
          </span>
        </div>

        <div className="w-full h-3 bg-zinc-700 rounded-full mb-4 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${device.color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${fillPercent}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 min-h-[80px]">
          <AnimatePresence>
            {collection.map((movie) => (
              <motion.div
                key={movie.kinopoisk_id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="relative group"
              >
                <img
                  src={
                    movie.poster_url ||
                    "https://via.placeholder.com/80x120?text=..."
                  }
                  alt={movie.title}
                  className="w-full h-auto object-cover rounded-lg border border-white/10"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x120?text=";
                  }}
                />
                <button
                  onClick={() => onRemove(movie.kinopoisk_id)}
                  className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {collection.length === 0 && (
            <div className="col-span-4 flex items-center justify-center text-gray-500 text-sm py-4">
              Добавьте фильм, чтобы заполнить носитель
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ================== ГЛАВНАЯ СТРАНИЦА (КОНСТРУКТОР + БИБЛИОТЕКИ) ==================
export default function ConstructorPage() {
  const { user, token } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState([]);
  const [deviceType, setDeviceType] = useState("usb");
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeMode, setActiveMode] = useState(null); // null | 'search' | 'top250' | ...
  const [activeGenre, setActiveGenre] = useState(null); // название жанра или null
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
        console.error("Ошибка загрузки коллекции:", err);
      } finally {
        setInitialLoad(false);
      }
    })();
  }, [user, token]);

  // Загрузка фильмов при смене режима или поискового запроса
  const loadMovies = useCallback(async () => {
    setLoading(true);
    let movies = [];
    try {
      if (activeMode === "search" && query.trim().length >= 2) {
        // Поиск по названию
        movies = await fetchMovies(
          "/films/search-by-keyword",
          `keyword=${encodeURIComponent(query)}`,
          "v2.1"
        );
      } else if (activeMode && activeMode.startsWith("genre:")) {
        // Поиск по жанру (ключевому слову)
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
        // Готовая подборка
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

  // Добавление в коллекцию
  const addToCollection = async (movie) => {
    if (!user || !token) return;
    const movieId = movie.filmId;
    if (collection.some((item) => item.kinopoisk_id === movieId)) return;
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

  // Удаление из коллекции
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
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Ошибка удаления");
      }
      setCollection((prev) =>
        prev.filter((item) => item.kinopoisk_id !== kinopoiskId)
      );
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить фильм: " + err.message);
    }
  };

  // Обработчики кнопок
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
      setActiveMode(null);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setActiveMode(null);
    setActiveGenre(null);
    searchInputRef.current?.focus();
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

          {/* Вкладки готовых подборок */}
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

          {/* Поисковая строка */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Поиск по названию фильма..."
                className="w-full py-4 pl-12 pr-12 bg-zinc-800/50 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-red-500 outline-none transition-colors text-lg"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-red-500 transition-colors"
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

          {/* Жанровые фильтры */}
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
            {/* Результаты фильмов */}
            <div className="lg:col-span-2">
              {results.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {activeMode === "search"
                      ? `Результаты поиска: "${query}"`
                      : activeGenre
                      ? `Жанр: ${activeGenre}`
                      : activeMode
                      ? collectionsQuick.find((c) => c.key === activeMode)
                          ?.label
                      : "Фильмы"}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <AnimatePresence>
                      {results.map((movie) => (
                        <motion.div
                          key={movie.filmId}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative overflow-hidden rounded-xl bg-zinc-800/50 border border-white/10 group"
                        >
                          <img
                            src={
                              movie.posterUrl ||
                              "https://via.placeholder.com/300x450?text=Нет+постера"
                            }
                            alt={movie.nameRu}
                            className="w-full h-52 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x450?text=Нет+постера";
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
                                onClick={() => addToCollection(movie)}
                                disabled={collection.some(
                                  (m) => m.kinopoisk_id === movie.filmId
                                )}
                                className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                aria-label="Добавить в коллекцию"
                              >
                                <Plus className="w-4 h-4" />
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
                  <p className="text-lg mb-2">
                    {!activeMode
                      ? "Выберите подборку, жанр или начните поиск"
                      : loading
                      ? "Загрузка..."
                      : "Ничего не найдено"}
                  </p>
                  <p className="text-sm">
                    Попробуйте изменить запрос или выбрать другую категорию
                  </p>
                </div>
              )}
            </div>

            {/* Панель коллекции */}
            <div className="space-y-6">
              <StorageFiller
                collection={collection}
                type={deviceType}
                onChangeType={setDeviceType}
                onRemove={removeFromCollection}
              />
              <Link
                to="/catalog"
                className="block w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl text-center font-semibold transition-colors"
              >
                Перейти к выбору носителя
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
